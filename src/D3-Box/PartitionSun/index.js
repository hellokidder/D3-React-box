import React, { Component } from 'react';
import * as d3 from 'd3';

class PartitionSun extends Component {

  componentDidMount() {
    const {data,layout} = this.props
    const width = layout.width
    const height = layout.height
    const padding = { top: 40,left:40, right:40,bottom:40}
    const svg = d3.select("#partitionsun")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    const partitions = svg.append("g")
    .attr("transform",`translate(${width/2},${height/2})`);


    const root = d3.hierarchy(data)
    .sum(function(d){
      return d.value;
    });

    var color = d3.scaleSequential(d3.interpolateOrRd)
      .domain([5, 0])

    const radius = (height-padding.top-padding.bottom)/2
    var partitionLayout = d3.partition();
    partitionLayout.size([2 * Math.PI, radius])

    partitionLayout(root);

    var arcGenerator = d3.arc()
  .startAngle(function(d) { return d.x0; })
  .endAngle(function(d) { return d.x1; })
  .innerRadius(function(d) { return d.y0; })
  .outerRadius(function(d) { return d.y1; })

    var nodes = partitions.selectAll('rect')
  .data(root.descendants())
  .enter()

    console.log(root.descendants())
  nodes.append('path')
  // .attr('transform', function (d) { return `translate(${height/2}, ${width/2})` })
  .attr("d",arcGenerator)
  .style("stroke", "black")
  .style('fill', function (d) {
    return color(d.depth)
  })

// nodes
//   .append('text')
//   .attr('text-anchor',"start")
//   .style('fill', "#a2a2a2")
//   .style("stroke", "none")
//   .text(function (d) {
//     console.log(d)
//     return d.data.name
//   })
//   .attr('dx', function (d) {
//     return d.x0
//   })
//   .attr('dy', function (d) {
//     return d.y0
//   })
  }
  render() {
    return (
      <div id="partitionsun"  style={{ display: "inline-block", position: "relative" }} >
      </div>
    );
  }
}
export default PartitionSun;
