'use strict';
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


var allArtists = [
  { id: '000001',
    name: 'Jain',
    image: 'https://i.scdn.co/image/6e4d8ba95cb31c0475179d55c2af4760136d304f',
    children: [
      {
        id: '000002',
        name: 'Lady Gaga',
        image: 'https://i.scdn.co/image/5210a7fa24a58b3bc8109082fa7292afe437458f',
        children: [
          {
            id: '3881838',
            name: 'Gwen Stefani',
            image: 'https://i.scdn.co/image/82a1aaedb700c8e13ae91e54c2c3329e1839c7ca',
            children: []
          }
        ]
      },
      {
        id: '000003',
        name: 'Katy Perry',
        image: 'https://i.scdn.co/image/fcdc433e8ccf8d46d58ac70db322feb9b3328731',
        children: []
      }
    ]
  }
];

// d3.json('flare.json', function(error, flare) {
//   if (error) throw error;

//   root = flare;
//   root.x0 = height / 2;
//   root.y0 = 0;

//   function collapse(d) {
//     if (d.children) {
//       d._children = d.children;
//       d._children.forEach(collapse);
//       d.children = null;
//     }
//   }

//   root.children.forEach(collapse);
//   update(root);
// });

root = allArtists[0];
root.x0 = height / 2;
root.y0 = 0;

function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

root.children.forEach(collapse);
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

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', function(d) { return 'translate(' + source.x0 + ',' + source.y0 + ')'; })
    .on('click', click);

  // nodeEnter.append('circle')
  //   .attr('r', 1e-6)
  //   .style('fill', function(d) { return d._children ? 'lightsteelblue' : '#fff'; });

  node.append('circle')
    .attr('r', 1e-6)
    .style('fill', 'transparent') // this code works OK
    .style('stroke', 'black') // displays small black dot
    .style('stroke-width', 0.25)
    .on('mouseover', function(){ // when I use .style("fill", "red") here, it works
      d3.select(this)
        .style('fill', function(d) { return d.image; });
    })
    .on('mouseout', function(){
      d3.select(this)
        .style('fill', 'transparent');
    });


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
    .style('fill', function(d) { return d._children ? 'lightsteelblue' : '#fff'; });

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
