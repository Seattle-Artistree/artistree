//import getAuthInstance from './controllers/auth-template';
var accessToken = '';
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
        url: 'https://api.spotify.com/v1/artists/5BcAKTbp20cv7tC5VqPFoC',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
          accessToken = access_token;
          console.log(response);
          var id = response.id;
          var name = response.name;
          var image = response.images[0].url;
          var topArtist = new Artist(id, name, image);
          console.log('topArtist', topArtist);
          artists.push(topArtist);
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

// var allArtists = [
//   { id: '000001',
//     name: 'Jain',
//     image: 'https://i.scdn.co/image/6e4d8ba95cb31c0475179d55c2af4760136d304f',
//     children: [
//       {
//         id: '000002',
//         name: 'Lady Gaga',
//         image: 'https://i.scdn.co/image/5210a7fa24a58b3bc8109082fa7292afe437458f',
//         children: [
//           {
//             id: '3881838',
//             name: 'Gwen Stefani',
//             image: 'https://i.scdn.co/image/82a1aaedb700c8e13ae91e54c2c3329e1839c7ca',
//             children: []
//           }
//         ]
//       },
//       {
//         id: '000003',
//         name: 'Katy Perry',
//         image: 'https://i.scdn.co/image/fcdc433e8ccf8d46d58ac70db322feb9b3328731',
//         children: []
//       }
//     ]
//   }
// ];

console.log("artists", artists);
top = artists[0];
root = top;
console.log('root', root);
console.log('root-id', root.id);
root.x0 = height / 2;
root.y0 = 0;

function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

if (root.children) {
  root.children.forEach(collapse);
}
update(root);

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

  //get related artists
  console.log('node', d3.select(node).datum());
  console.log('source-id', node.id);
  getRelatedArtists(node.id);

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

  // node.append('image')
  //   .attr('id', 'artist_image')
  //   .style('border-radius', '50%')
  //   .attr('xlink:href', function(d) { return d.image; })
  //   .attr('x', -55)
  //   .attr('y', -55)
  //   .attr('width', 110)
  //   .attr('height', 110);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

  nodeUpdate.select('circle')
    .attr('r', 50)
    .style('filter', function(d) { return d.image; });

  nodeUpdate.select('text')
    .style('fill-opacity', 1);

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

function getRelatedArtists(artistId) {
  console.log("artistId", artistId);
  $.ajax({
    url: 'https://api.spotify.com/v1/artists/' + artistId + '/related-artists',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    success: function (response) {
      //accessToken = access_token;
      console.log(response);
      // var id = response.id;
      // var name = response.name;
      // var image = response.images[0].url;
      // var topArist = new Artist(id, name, image);
      // console.log('topArtist', topArist);
      // allArtists.push(topArist);
      // userProfilePlaceholder.innerHTML = userProfileTemplate(response);
      $('#login').hide();
      $('#loggedin').show();
    }
  });
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
  //console.log("d", d);
  //getRelatedArtists(d.id);
  update(d);
}

function Artist(id, name, image) {
  this.id = id;
  this.name = name;
  this.image = image;
  this.children = [];
}
//console.log(api_response.items[0].images[0].url);