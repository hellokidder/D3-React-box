import React, { Component } from 'react';
import * as d3 from 'd3';

class Treemap extends Component {

  componentDidMount() {
    const {data,layout} = this.props
    const width = layout.width
    const height = layout.height
    const padding = { top: 40,left:40, right:40,bottom:40}
    const svg = d3.select("#treemap")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    const treemap = svg.append("g")
    .attr("transform",`translate(${padding.top},${padding.left})`);


    const root = d3.hierarchy(data)
    .sum(function(d){
      return d.value;
    });

    var color = d3.scaleSequential(d3.interpolateYlGn)
      .domain([5, -5])

    var treeLayout = d3.treemap();
    treeLayout.size([width-padding.left-padding.right, height-padding.top-padding.bottom])
    .paddingOuter(20)
    treeLayout(root);

    var nodes = treemap.selectAll('g')
  .data(root.descendants())
  .enter()
  .append('g')
      .attr('transform', function (d) { return `translate(${d.x0}, ${d.y0})` })
      .style('fill', "none")
      .style("stroke", "blue")

nodes
.append('rect')
.attr('width', function(d) { return d.x1 - d.x0; })
.attr('height', function(d) { return d.y1 - d.y0; })
.style("stroke", "black")
  .style('fill', function (d) {
    console.log(d)
    return color(d.depth)
  })

nodes
  .append('text')
  .attr('text-anchor',"start")
  .style('fill', "#a2a2a2")
  .style("stroke", "none")
  .attr('dx', 4)
  .attr('dy', 14)
  // .style("font-size", function (d) {
  //   console.log(d)
  //   return d.r*3/5
  // })
  .text(function(d) {
    return d.data.name
  })
  }
  render() {
    return (
      <div id="treemap"  style={{ display: "inline-block", position: "relative" }} >
      </div>
    );
  }
}

export default Treemap;
