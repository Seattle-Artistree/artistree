
var margin = {top: 100, right: 50, bottom: 20, left: 50},
  width = jQuery(window).width(); - margin.right - margin.left,
  height = jQuery(window).height(); - margin.top - margin.bottom;

var i = 0,
  duration = 750,
  root;

var tree = d3.layout.tree()
  .size([height, width]);

var diagonal = d3.svg.diagonal()
  .projection(function(d) { return [d.x, d.y]; });

var svg = d3.select('#discover-view').append('svg')
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