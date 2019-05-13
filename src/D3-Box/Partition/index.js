import React, { Component } from 'react';
import * as d3 from 'd3';

class Partition extends Component {

  componentDidMount() {
    const {data,layout} = this.props
    const width = layout.width
    const height = layout.height
    const padding = { top: 40,left:40, right:40,bottom:40}
    const svg = d3.select("#partition")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    const partitions = svg.append("g")
    .attr("transform",`translate(${padding.top},${padding.left})`);


    const root = d3.hierarchy(data)
    .sum(function(d){
      return d.value;
    });

    var color = d3.scaleSequential(d3.interpolateYlGn)
      .domain([5, -5])

    var partitionLayout = d3.partition();
    partitionLayout.size([width-padding.left-padding.right, height-padding.top-padding.bottom])

    partitionLayout(root);

    var nodes = partitions.selectAll('rect')
  .data(root.descendants())
  .enter()
  .append('rect')
  // .attr('transform', function (d) { return `translate(${d.x0}, ${d.y0})` })
  .attr('y', function(d) { return d.y0; })
  .attr('x', function(d) { return d.x0; })
  .attr('height', function(d) { return d.y1 - d.y0; })
  .attr('width', function(d) { return d.x1 - d.x0; })
  .style("stroke", "black")
  .style('fill', function (d) {
    console.log(d,color[d.depth])
    return color(d.depth)
  })

nodes
  .append('text')
  .attr('text-anchor',"start")
  .style('fill', "#a2a2a2")
  .style("stroke", "none")
  .text(function(d) {
    return d.data.name
  })
  // .attr('dx', 4)
  // .attr('dy', 14)
  // .style("font-size", function (d) {
  //   console.log(d)
  //   return d.r*3/5
  // })
  }
  render() {
    return (
      <div id="partition"  style={{ display: "inline-block", position: "relative" }} >
      </div>
    );
  }
}
export default Partition;
