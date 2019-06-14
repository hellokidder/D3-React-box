import React, { Component } from 'react';
import * as d3 from 'd3';

class Pack extends Component {

  componentDidMount() {
    const {data,layout} = this.props
    const width = layout.width
    const height = layout.height
    const padding = { top: 40,left:40, right:40,bottom:40}
    const svg = d3.select("#Pack")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    const pack = svg.append("g")
    .attr("transform",`translate(${padding.top},${padding.left})`);


    const root = d3.hierarchy(data)
    .sum(function(d){
      return d.value;
    });

    var color = d3.scaleSequential(d3.interpolateYlGn)
    .domain([5, -5])
    var treeLayout = d3.pack();
    treeLayout.size([width-padding.left-padding.right, height-padding.top-padding.bottom])
    .padding(0)
    treeLayout(root);

    var nodes = pack.selectAll('g')
  .data(root.descendants())
  .enter()
  .append('g')
      .attr('transform', function (d) { return `translate(${d.x}, ${d.y})` })
      .style('fill', "none")
      .style("stroke", "blue")

nodes
  .append('circle')
  .attr('r', function (d) {
    return d.r;
  })
  .style("stroke", "none")
  .style('fill', function (d) { return color(d.depth) })

nodes
  .append('text')
  .attr('text-anchor',"middle")
  .style('fill', "#a2a2a2")
  .style("stroke", "none")
  .style("font-size", function (d) {
    // console.log(d)
    return d.r*3/5
  })
  .text(function(d) {
    return d.children === undefined ? d.data.name : '';
  })
  }
  render() {
    return (
      <div id="Pack"  style={{ display: "inline-block", position: "relative" }} >
      </div>
    );
  }
}

export default Pack;
