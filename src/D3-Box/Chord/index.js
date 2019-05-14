import React, { Component } from 'react';
import * as d3 from 'd3';

class Chord extends Component {

  componentDidMount() {
    const {data,layout} = this.props
    const width = layout.width
    const height = layout.height
    const padding = { top: 40, left: 40, right: 40, bottom: 40 }
    // const color =  ["#1890FF", "#2FC25B", "#FACC14", "#223273", "#8543E0","#13C2C2","#3436C7","#F04864"]
    const outerRadius = Math.min(width-padding.left-padding.right, height-padding.top-padding.bottom) * 0.5 - 40
    const innerRadius = outerRadius - Math.min(width-padding.left-padding.right, height-padding.top-padding.bottom) * 0.08

    const svg = d3.select("#chord")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

      var cho = d3.chord()
      .padAngle(0.1)
      .sortSubgroups(d3.descending)(data.matrix)

      let color = d3
      .scaleOrdinal() // 四种颜色
      .domain(d3.range(4))
      .range(["#1890FF", "#2FC25B", "#FACC14", "#223273",])

      var ribbonGenerator = d3.ribbon().radius(innerRadius);

      let arc = d3
      .arc() // 用于画弧
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)


      const chord = svg.append("g")
      .attr("transform",`translate(${width/2},${height/2})`)

      chord.append('g')
      .selectAll('path')
      .data(cho)
      .enter()
      .append('path')
      .attr('d', ribbonGenerator)
      .style("opacity",0.5)
      .style('fill', function(d) {
        return color(d.target.index)
      })
        .style('stroke', function (d) {
          return d3.rgb(color(d.target.index)).darker()
      })

      const group = chord
      .append('g') // 画刻度组
      .selectAll('g')
      .data(cho.groups)
      .enter()

    group.append('path')
    .style('fill', function (d) {
      return color(d.index)
    })
    .style('stroke', function(d) {
      return d3.rgb(color(d.index)).darker()
    })
    .style("opacity",0.3)
      .attr('d', arc)

    const groupTick = group
      .selectAll('.group-tick') // 画刻度
      .data(function(d) {
        return groupTicks(d, 1e3)
      })
      .enter()
      .append('g')
      .attr('class', 'group-tick')
      .attr('transform', function(d) {
        return (
          'rotate(' +
          ((d.angle * 180) / Math.PI - 90) +
          ') translate(' +
          outerRadius +
          ',0)'
        )
      })
      .style('stroke', "#585858")

      group
      .append('g')
      .attr('transform', function(d) {
        return (
          'rotate(' +
          (((d.endAngle - (d.endAngle - d.startAngle) / 2) * 180) / Math.PI -
            90) +
          ') translate(' +
          (outerRadius + 40) +
          ',0)'
        )
      })
      .append('text')
      .attr('fill', function(d) {
        return color(d.index)
      })
      .attr('x', 8)
      .attr('dy', '.35em')
      .attr('transform', function(d) {
        return d.endAngle - (d.endAngle - d.startAngle) / 2 > Math.PI
          ? 'rotate(180) translate(-16)'
          : null
      })
      .style('text-anchor', function(d) {
        return d.endAngle - (d.endAngle - d.startAngle) / 2 > Math.PI
          ? 'end'
          : null
      })
      .style('font-size', '16px')
      .style('font-weight', '700')
      .text(function(d) {
        return data.names[d.index]
      })

    groupTick
      .append('line') // 画刻度线
      .attr('x2', 6)
    groupTick
      .filter(function(d) {
        return d.value % 5e3 === 0
      })
      .append('text')
      .attr('x', 8)
      .attr('dy', '.35em')
      .attr('stroke-width','1')
      .attr('transform', function(d) {
        return d.angle > Math.PI ? 'rotate(180) translate(-16)' : null
      })
      .style('text-anchor', function(d) {
        return d.angle > Math.PI ? 'end' : null
      })
      .style("font-size", '10')
      .text(function(d) {
        return (d.value / 10000).toFixed(2) + '万'
      })



    function groupTicks(d, step) {
      var k = (d.endAngle - d.startAngle) / d.value
      return d3.range(0, d.value, step).map(function(value) {
        return { value: value, angle: value * k + d.startAngle }
      })
    }
  }
  render() {
    return (
      <div id="chord"  style={{ display: "inline-block", position: "relative" }} >
      </div>
    );
  }
}
export default Chord;
