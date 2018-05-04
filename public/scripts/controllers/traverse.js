'use strict';

var accessToken = '';
var toBeSeen = [];
var root;
var artists = [];

(function() {
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g, q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
  var userProfileSource = document.getElementById('user-profile-template')
    .innerHTML, userProfileTemplate = Handlebars.compile(userProfileSource), 
    userProfilePlaceholder = document.getElementById('user-profile');

  var oauthSource = document.getElementById('oauth-template')
    .innerHTML, oauthTemplate = Handlebars.compile(oauthSource), 
    oauthPlaceholder = document.getElementById('oauth');

  var params = getHashParams();
  var access_token = params.access_token, refresh_token = params.refresh_token, error = params.error;
  if (error) {
    alert('There was an error during the authentication');
  }
  else {
    if (access_token) {
      // render oauth info
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });
      $.ajax({
        url: 'https://api.spotify.com/v1/me/top/artists',
        headers: {
          'Authorization': 'Bearer ' + access_token
          // API JSON traversals
            // items[0].id
            // items[0].name
            // items[0].images[2].url
              // Using the 200px image to save some loading time
        },
        success: function (response) {
          console.log('TOP artist response', response);
          accessToken = access_token;
          var id = response.items[0].id;
          var name = response.items[0].name;
          var image = response.items[0].images[2].url;
          var parentId = 0;
          var topArtist = {'id': id, 'name': name, 'image': image, 'parentId': parentId};
          artists.push(topArtist);
          var topPerson = artists[0];

          var allArtists = [];
          var firstArtist = [topPerson];
          
          console.log("FIRST ARTIST", artists[0]);
          console.log("CALLING getRelatedArtists WITH FIRST ARTIST", allArtists);

          // adding a callback function to getOtherArtists
          // so that the rest of the code does not execute until
          // this function is finished (async problems)
          getOtherArtists(artists, 0, allArtists, function(totalArtists) {
            var artist_tree = unflatten(totalArtists);
            root = artist_tree[0];
            root.x0 = height / 2;
            root.y0 = 0;
           
            console.log("ARTIST_TREE: ", artist_tree);
            triggerUpdateRoot(root);
          });

          userProfilePlaceholder.innerHTML = userProfileTemplate(response);

          $('#login').hide();
          $('#loggedin').show();
        }
      });
    }
    else {
      // render initial screen
      $('#login').show();
      $('#loggedin').hide();
    }
    document.getElementById('obtain-new-token').addEventListener('click', function () {
      $.ajax({
        url: '/refresh_token',
        data: {
          'refresh_token': refresh_token
        }
      }).done(function (data) {
        access_token = data.access_token;
        oauthPlaceholder.innerHTML = oauthTemplate({
          access_token: access_token,
          refresh_token: refresh_token
        });
      });
    }, false);
  }
})();


// *********** Artist Handler Logic ***********

function unflatten(arr) {
  var tree = [],
      mappedArr = {},
      arrElem,
      mappedElem;

  // First map the nodes of the array to an object -> create a hash table.
  for(var i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id].children = [];
  }


  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      // If the element is not at the root level, add it to its parent array of children.
      if (mappedElem.parentId) {
        mappedArr[[mappedElem.parentId]]['children'].push(mappedElem);
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
}

async function getOtherArtists(toBeSeen, x, totalArtists, callback) {
  console.log("TOTAL ARTISTS:  ", totalArtists);
  console.log("TO BE SEEN:  ", toBeSeen);

  while (x < 51) {
    var next = toBeSeen[0];
    var p = await $.ajax({
      url: 'https://api.spotify.com/v1/artists/' + next.id + '/related-artists',
      headers: {
        Authorization: 'Bearer ' + accessToken
      },
        success: function(response) {
          var id1 = response.artists[2].id;
          var name1 = response.artists[2].name;
          var image1 = response.artists[2].images[2].url;
          var relatedArtist1 = {'id': id1, 'name': name1, 'image': image1, 'parentId': next.id};

          var id2 = response.artists[19].id;
          var name2 = response.artists[19].name;
          var image2 = response.artists[19].images[2].url;
          var relatedArtist2 = {'id': id2, 'name': name2, 'image': image2, 'parentId': next.id};
          toBeSeen.push(relatedArtist1);
          toBeSeen.push(relatedArtist2);

          toBeSeen.shift();
          totalArtists.push(next);

          $('#login').hide();
          $('#loggedin').show();
        }
      });
      x = x + 1;
  }
  callback(totalArtists);
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}