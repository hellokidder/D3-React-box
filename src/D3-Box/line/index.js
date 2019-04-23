import React, { Component } from 'react';
import * as d3 from 'd3';
import {testCsvData, csv2linedata, findMinMax} from '../utils/utils'


class Line extends Component {

  componentDidMount() {
    const width = 1000
    const height = 500
    const padding = { top: 40, left: 45, right: 40, bottom: 40 }
    const pathwidth = width - padding.left - padding.right
    const pathheight = height - padding.top - padding.bottom
    const color = ["#008ffa", "#00c061", "#ffcb3c","#EE2764","#223670"]

    const csvTest = testCsvData()
    const csv = d3.csvParse(csvTest)

    const lineType = ["A", "B", "C", "PT"]
    const X = "T"

    const data = csv2linedata(csv,lineType,X)
    console.log("data", data)
    const yMinMax = findMinMax(csv, lineType)
    const xMinMax = findMinMax(csv,["T"])

    // 放大器
    var scaleX = d3.scaleLinear()
      .domain([xMinMax.min,xMinMax.max]).nice()
      .range([0, pathwidth])
    var scaleY = d3.scaleLinear()
      .domain([yMinMax.min,yMinMax.max]).nice()
      .range([ pathheight,0])

    // 线条生成器
    var lineGengeator = d3.line()
      .x(function (d) {
        return scaleX(d[0])
      })
      .y(function (d) {
        return scaleY(d[1])
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
    // 折线
    svg.selectAll("path.line")
    .data(data)
    .enter()
      .append("path")
      .style("fill", "none")
      .style("stroke", function(d,i){return d.color?d.color:color[i]})
      .style("stroke-width", "2")
      .attr("d", function (d) {
        return lineGengeator(d.data)
      })
      .attr("transform", `translate(${padding.left},${padding.top})`)

    function axisColor(axis,path,g,text) {
      axis.select("path")
      .attr("stroke", path)
      .attr("stroke-width", "2")
      axis.selectAll("g")
      .select("line")
      .attr("stroke", g)
        .attr("stroke-width", "1")
      axis.selectAll("g")
      .select("text")
      .attr("stroke", text)
    }
    axisColor(axisX, "#dddddd", "#dddddd","#dddddd")
    axisColor(axisY,"white","#dddddd","#dddddd")

  }
  render() {
    return (
      <div id = "line">
      </div>
    );
  }
}

export default Line;
