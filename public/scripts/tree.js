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
  var userProfileSource = document.getElementById('user-profile-template').innerHTML, userProfileTemplate = Handlebars.compile(userProfileSource), userProfilePlaceholder = document.getElementById('user-profile');
  var oauthSource = document.getElementById('oauth-template').innerHTML, oauthTemplate = Handlebars.compile(oauthSource), oauthPlaceholder = document.getElementById('oauth');
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
        url: 'https://api.spotify.com/v1/artists/6vWDO969PvNqNYHIOW5v0m',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
          accessToken = access_token;
          var id = response.id;
          var name = response.name;
          var image = response.images[0].url;
          var parentid = 0;
          var topArtist = {'id': id, 'name': name, 'image': image, 'parentid': parentid};
          artists.push(topArtist);
          var topperson = artists[0];

          var allArtists = [];
          var firstArtist = [topperson];
          
          console.log("FIRST ARTIST", artists[0]);
          console.log("CALLING GETRELATEDARTISTS WITH FIRST ARTIST", allArtists);

          //adding a callback function to getOtherArtists
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

var margin = {top: 20, right: 120, bottom: 20, left: 120},
  width = 960 - margin.right - margin.left,
  height = 800 - margin.top - margin.bottom;

var i = 0,
  duration = 750,
  root;

var tree = d3.layout.tree()
  .size([height, width]);

var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.x, d.y]; });

var svg = d3.select('#loggedin').append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}
function triggerUpdateRoot(root) {
  if (root.children) {
    root.children.forEach(collapse);
  }
  update(root);
}

d3.select(self.frameElement).style('height', '800px');

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 100; });

  // Update the nodes…
  var node = svg.selectAll('g.node')
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // getRelatedArtists(source);

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', function(d) { return 'translate(' + source.x0 + ',' + source.y0 + ')'; })
    .on('click', click);

  nodeEnter.append('circle')
    .attr('r', 1e-6)
    .style('filter', function(d) { return d.image; });

  /* DO NOT DELETE THIS COMMENT!!! 
     THIS IS COMMENTED OUT FOR TESTING.  
  */

  nodeEnter.append('text')
    .attr('dx', 60)
    .attr('dy', '.35em')
    .text(function(d) { return d.name; });

  node.append('image')
    .attr('id', 'artist_image')
    .style('border-radius', '50%')
    .attr('xlink:href', function(d) { return d.image; })
    .attr('x', -55)
    .attr('y', -55)
    .attr('width', 110)
    .attr('height', 110);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

  nodeUpdate.select('circle')
    .attr('r', 50)
    .style('filter', function(d) { return d.image; });

  nodeUpdate.select('text')
    .style('fill-opacity', 1);

  svg.selectAll('g.nodes').remove();
  svg.selectAll('g.nodes')
    .data(nodes, function(d) { return d.id || (d.id = ++i); })
    .enter()
    .append('g');

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr('transform', function(d) { return 'translate(' + source.x + ',' + source.y + ')'; })
    .remove();

  nodeExit.select('circle')
    .attr('r', 1e-6);

  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // Update the links…
  var link = svg.selectAll('path.link')
    .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert('path', 'g')
    .attr('class', 'link')
    .attr('d', function(d) {
      var o = {x: source.x0, y: source.y0};
      return diagonal({source: o, target: o});
    });

  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr('d', diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr('d', function(d) {
      var o = {x: source.x, y: source.y};
      return diagonal({source: o, target: o});
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

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
    if (mappedElem.parentid) {
      mappedArr[[mappedElem.parentid]]['children'].push(mappedElem);
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

  while (x < 31) {
    var next = toBeSeen[0];
    var p = await $.ajax({
      url: 'https://api.spotify.com/v1/artists/' + next.id + '/related-artists',
      headers: {
        Authorization: 'Bearer ' + accessToken
      },
        success: function(response) {
          var id1 = response.artists[2].id;
          var name1 = response.artists[2].name;
          var image1 = response.artists[2].images[0].url;
          var relatedArtist1 = {'id': id1, 'name': name1, 'image': image1, 'parentid': next.id};

          var id2 = response.artists[19].id;
          var name2 = response.artists[19].name;
          var image2 = response.artists[19].images[0].url;
          var relatedArtist2 = {'id': id2, 'name': name2, 'image': image2, 'parentid': next.id};

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

function Artist(id, name, image, parentid) {
  this.id = id;
  this.name = name;
  this.image = image;
  this.parentid = parentid;
}