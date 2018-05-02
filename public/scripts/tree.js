var accessToken = '';
//var toBeSeen = []; 
var totalArtists = [];
var root;

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
          //console.log('api response', response);
          var artists = [];

          var id = response.id;
          var name = response.name;
          var image = response.images[0].url;
          var parent_id = 0;
          var topArtist = {'id': id, 'name': name, 'image': image, 'parent_id': parent_id};
          artists.push(topArtist);
          //var topperson = artists[0];

          var allArtists = [];
          //var firstArtist = [topperson];
          
          console.log("FIRST ARTIST", artists);
          console.log("CALLING GETRELATEDARTISTS WITH FIRST ARTIST", allArtists);
          getOtherArtists(artists, 1, allArtists)

          // var deferred = getRelatedArtists(totalArtists, toBeSeen, 0).defer();

          // console.log("DEFERRED", deferred);

          // $.when(deferred).done(function() {
          //   console.log("RELATED ARTISTS CALLS FINISHED");
          // });

          //var toproot = artists[0];

          // if (!root.children) {
          //   root.children.forEach(collapse);
          // }

          // console.log('updating root', root.name);
          // update(root);

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
function test(root) {
  if (root.children) {
    root.children.forEach(collapse);
  }
  // console.log('updating root');
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


// getAllEmployees: function() {
//   let allEmployees = []; // this array will contain all employees
//   let pageNumber = 1; // start with page 1
//   const getThoseEmployees = function(pageNumber) {
//       return axios.get(rest_url + 'users/?per_page=50&page=' + pageNumber, {
//           headers: {
//               'X-WP-Nonce': WPsettings.nonce
//           },
//       }).then(response => {
//           // add the employees of this response to the array
//           allEmployees = allEmployees.concat(response.data);
//           pageNumber++;
//           if (response.headers['x-wp-total'] > allEmployees.length) {
//               // do me again...
//               return getThoseEmployees(pageNumber);
//           } else {
//               // this was the last page, return the collected contacts
//               return allEmployees;
//           }
//       });
//   }
//   return getThoseEmployees();
// },


// // after "created" in vue
// this.allEmployees = this.getAllEmployees(); // returns "promise"

function getNestedChildren(arr, parent_id) {
  var out = []
  for(var i in arr) {
      console.log("element", arr[i]);
      console.log("parent_id", parent_id)
      if(arr[i].parent_id == parent_id) {
          var children = getNestedChildren(arr, arr[i].id)

          if(children.length) {
              arr[i].children = children
          }
          console.log("out", out);
          out.push(arr[i])
      }
  }
  return out
}

function treeify(list, idAttr, parentAttr, childrenAttr) {
  if (!idAttr) idAttr = 'id';
  if (!parentAttr) parentAttr = 'parent_id';
  if (!childrenAttr) childrenAttr = 'children';
  var treeList = [];
  var lookup = {};
  list.forEach(function (obj) {
    lookup[obj[idAttr]] = obj;
    obj[childrenAttr] = [];
  });
  list.forEach(function (obj) {
    if (lookup[obj[parentAttr]] != null) {
      console.log("inside if", obj[parentAttr]);
      lookup[obj[parentAttr]][childrenAttr].push(obj);
    } else {
      treeList.push(obj);
    }
  });
  return treeList;
};

var arr = [
  {'id':"Jain" ,'parentid' : 0},
  {'id':"Beyonce" ,'parentid' : "Train"},
  {'id':"Train", 'parentid' : "Jain"},
  {'id':"Kylie Minogue" ,'parentid' : "Beyonce"},
  {'id':"No Doubt" ,'parentid' : "Kylie Minogue"}
];

function unflatten(arr) {
var tree = [],
    mappedArr = {},
    arrElem,
    mappedElem;

// First map the nodes of the array to an object -> create a hash table.
for(var i = 0, len = arr.length; i < len; i++) {
  arrElem = arr[i];
  mappedArr[arrElem.id] = arrElem;
  mappedArr[arrElem.id]['children'] = [];
}


for (var id in mappedArr) {
  if (mappedArr.hasOwnProperty(id)) {
    mappedElem = mappedArr[id];
    // If the element is not at the root level, add it to its parent array of children.
    if (mappedElem.parentid) {
      mappedArr[mappedElem['parentid']]['children'].push(mappedElem);
    }
    // If the element is at the root level, add it to first level elements array.
    else {
      tree.push(mappedElem);
    }
  }
}
return tree;
}

console.log("TESTING UNFLATTEN", unflatten(arr));

function getOtherArtists(toBeSeen, x, totalArtists) {
  //console.log("Artists to be seen: ", toBeSeen);
  //console.log("Artists in our list: ", totalArtists);

  var next = toBeSeen.pop();
  console.log("FETCHING ARTISTS FOR :", next.id);
  $.ajax({
    url: 'https://api.spotify.com/v1/artists/' + next.id + '/related-artists',
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
      success: function(response) {
        console.log(response);
        var id1 = response.artists[14].id;
        var name1 = response.artists[14].name;
        var image1 = response.artists[14].images[0].url;
        var parent1 = next.id;
        var relatedArtist1 = {'id': id1, 'name': name1, 'image': image1, 'parent_id': parent1};
        //console.log("ra 1", relatedArtist1);

        var id2 = response.artists[9].id;
        var name2 = response.artists[9].name;
        var image2 = response.artists[9].images[0].url;
        var parent2 = next.id;
        var relatedArtist2 = {'id': id2, 'name': name2, 'image': image2, 'parent_id': parent2};
        //console.log("ra 2", relatedArtist2);

        toBeSeen.push(relatedArtist1, relatedArtist2);
        //toBeSeen.push(relatedArtist2);

        // update total artist list with the artist we just got
        // children for
        totalArtists.push(next);

        // if we haven't fetched 6 artists yet for our tree
        // keep making the recursive call so we can populate
        // out list of artists (which we will turn into a tree later)
        if (x < 10) {
          //console.log("STILL GETTING ARTISTS", toBeSeen);
          return getOtherArtists(toBeSeen, x+1, totalArtists);
        } else {
          console.log("FINAL ARTIST LIST", totalArtists);
          var first = totalArtists[0];
          console.log("first artist", first);
          var artist_tree = treeify(totalArtists);
          console.log("ARTIST_TREE: ", artist_tree);

          root = artist_tree[0];
          root.x0 = height / 2;
          root.y0 = 0;

          test(root);
          return totalArtists;
        }
        //getRelatedArtists(toBeSeen, x+1);
        // $('#login').hide();
        // $('#loggedin').show();
      }
    });
}

// function getRelatedArtists(toBeSeen) {
//   var totalArtists = [];
//   var x = 1
//   //console.log("EXITING FUNCTION HERE");
//   console.log("artists to be seen", toBeSeen.length);

//   console.log("total artists", totalArtists);

  

//   // console.log("NEXT ID", next.id);

//   function getThoseArtists(toBeSeen, x) {
//     var next = toBeSeen.pop();
//     console.log("INSIDE GET THOSE ARTISTS");
//     $.ajax({
//       url: 'https://api.spotify.com/v1/artists/' + next.id + '/related-artists',
//       headers: {
//         Authorization: 'Bearer ' + accessToken
//       },
//       async: false,
//       success: function(response) {
//         var id1 = response.artists[2].id;
//         var name1 = response.artists[2].name;
//         var image1 = response.artists[2].images[0].url;
//         var parent1 = next.id;
//         var relatedArtist1 = new Artist(id1, name1, image1, parent1);

//         var id2 = response.artists[3].id;
//         var name2 = response.artists[3].name;
//         var image2 = response.artists[3].images[0].url;
//         var parent2 = next.id;
//         var relatedArtist2 = new Artist(id2, name2, image2, parent2);

//         toBeSeen = toBeSeen.concat(relatedArtist1);
//         toBeSeen = toBeSeen.concat(relatedArtist2);

//         // update total artist list with the artist we just got
//         // children for
//         totalArtists = totalArtists.concat(next);

//         // if we haven't fetched 6 artists yet for our tree
//         // keep making the recursive call so we can populate
//         // out list of artists (which we will turn into a tree later)
//         if (x < 6) {
//           console.log("STILL GETTING ARTISTS", toBeSeen);
//           return getThoseArtists(toBeSeen, x+1);
//         } else {
//           console.log("FINAL ARTIST LIST", totalArtists);
//           return totalArtists;
//         }
//         //getRelatedArtists(toBeSeen, x+1);
//         $('#login').hide();
//         $('#loggedin').show();
//       }
//     });
//   }
//   return getThoseArtists(toBeSeen, 1);
// }


// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  // console.log('d', d);
  // getRelatedArtists(d.id);
  //update(d);
}

function Artist(id, name, image, parent_id) {
  this.id = id;
  this.name = name;
  this.image = image;
  this.parent_id = parent_id;
}
//console.log(api_response.items[0].images[0].url);