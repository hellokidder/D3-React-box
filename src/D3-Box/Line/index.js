import React, { Component } from 'react';
import * as d3 from 'd3';
import { lineConfig } from '../config/config'
import { findMinMax,data2linedata } from '../utils/utils'

class Line extends Component {

  componentDidMount() {
    const { data, axis, layout } = this.props;
    let padding = lineConfig.padding
    let width = lineConfig.width
    let height = lineConfig.height
    const color = lineConfig.color
    const thisaxis = {}
    const keys = Object.keys(data[0])
    thisaxis.X = axis.x ? axis.x : keys[0]
    keys.splice(keys.indexOf(thisaxis.X),1)
    thisaxis.Y = axis.y?axis.y :keys;
    if (layout !== undefined) {
      padding = layout.padding ? layout.padding : lineConfig.padding
      width = layout.width ? layout.width : lineConfig.width
      height = layout.height ? layout.height : lineConfig.height
    }
    const pathwidth = width - padding.left - padding.right
    const pathheight = height - padding.top - padding.bottom
    const minMaxY = findMinMax(data, thisaxis)
    const lineData = data2linedata(data, thisaxis.Y)

    // 放大器
    var scaleX = d3.scaleLinear()
      .domain([0,data.length-1]).nice()
      .range([0, pathwidth])
    var scaleY = d3.scaleLinear()
      .domain([minMaxY.min,minMaxY.max]).nice()
      .range([pathheight, 0])

    // 线条生成器
    var lineGengeator = d3.line()
      .x(function (d,i) {
        return scaleX(i)
      })
      .y(function (d) {
        return scaleY(d)
      })

    const x = d3.axisBottom(scaleX)
    const y = d3.axisLeft(scaleY)

    const svg = d3.select("#line")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    // y轴
    const axisY = svg.append("g")
      .attr("transform", `translate(${padding.left},${padding.top})`)
      .call(y)
    // X轴
    const axisX = svg.append("g")
      .attr("transform", `translate(${padding.left},${height - padding.bottom})`)
      .call(x)

    axisX.selectAll("g")
      .selectAll("text")
      .text(function (d) {
        if (d < data.length) {
          return data[d][thisaxis.X]
        }
      })

      function loopDrawLine(data) {
        for (let i = 0; i < data.length; i += 1){
          drawLine(data[i],i)
        }
      }

      function drawLine(linedata, i) {
        const lineColor = linedata.color ? linedata.color : color[i]
        console.log(linedata)
        svg.append("path")
          .style("fill", "none")
          .style("stroke", lineColor)
          .style("stroke-width", "2")
          .attr("d",  lineGengeator(linedata.data))
          .attr("transform", `translate(${padding.left},${padding.top})`)
      }
      loopDrawLine(lineData)
  }



  render() {
    return (
      <div id = "line">
      </div>
    );
  }
}

export default Line;
