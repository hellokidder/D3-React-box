import React, { Component } from 'react';
import * as d3 from 'd3';

class Pie extends Component {

  componentDidMount() {
    // const { data } = this.props
    const padding = { top: 160, bottom: 60, left: 160, right: 60 }
    const width = 300
    const height = 300
    const svg = d3.select("#Pie")
      .append('svg')
      .attr("width", width)
      .attr("height", height)

    const g = svg.append('g')
      .attr('transform', 'translate(' + padding.top + ',' + padding.left + ')')

    const dataSet = [100, 200, 500,700]
    const colorScale = d3.scaleOrdinal()
        .domain(d3.range(dataSet.length))
      .range(d3.schemeCategory10)

    const innerRadius = 50
    const outerRadius = 100
    const arc_generator = d3.arc()
      .padAngle(.1)
      .padRadius(20)
      .cornerRadius(4)
        .innerRadius(innerRadius)
      .outerRadius(outerRadius)

    const arcData = d3.pie()(dataSet)
    // console.log(arcData)

    const gs = g.selectAll('.g')
    .data(arcData)
    .enter()
    .append('g')

    gs.append('path')
    .attr('d', function(d) {
        return arc_generator(d)
    })
    .attr('fill', function(d, i) {
        return colorScale(i)
    })

    gs.append('text')
    .attr('transform', function(d) {
        //位置设在中心处
        return 'translate('+ arc_generator.centroid(d) +')'
    })
    .attr('text-anchor', 'middle')
    .text(function(d) {
        return d.data
    })

  }
  render() {
    return (
      <div id = "Pie">
      </div>
    );
  }
}

export default Pie;
