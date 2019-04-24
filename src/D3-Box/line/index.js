import React, { Component } from 'react';
import * as d3 from 'd3';
// import {testCsvData, csv2linedata, findMinMax} from '../utils/utils'
// import {findMinMax} from'../utils/utils'


class Line extends Component {

  componentDidMount() {
    const width = 1000
    const height = 500
    const padding = { top: 40, left: 45, right: 40, bottom: 40 }
    const pathwidth = width - padding.left - padding.right
    const pathheight = height - padding.top - padding.bottom
    const color = ["#008ffa", "#00c061", "#EE2764", "#ffcb3c", "#223670"]
    const {data} = this.props
    const dataLength = data[0].data.length

    // const csvTest = testCsvData()
    // const csv = d3.csvParse(csvTest)

    // const lineType = ["A", "B", "C", "PT"]
    // const X = "T"

    // const data = csv2linedata(csv,lineType,X)
    // console.log("data", data)
    // const yMinMax = findMinMax(data)
    // const xMinMax = findMinMax(csv,["T"])

    // 放大器
    var scaleX = d3.scaleLinear()
      .domain([0,9]).nice()
      .range([0, pathwidth])
    var scaleY = d3.scaleLinear()
      .domain([0,100]).nice()
      .range([pathheight, 0])

    var　scaleXZ = d3.scaleLinear()
    .domain([0,pathwidth])
    .range([0, 9])

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
      .on("mouseover", function () {
        tooltipLine.style("opacity",1)
      })
      .on("mousemove", function () {
        const m = d3.mouse(this)
        const a = Math.round((m[0] - padding.left) / (pathwidth / (dataLength - 1)))
        const pathX = a * (pathwidth / (dataLength - 1))
        // console.log(scaleXZ(pathX))
        svg.selectAll("circle")
          .attr("stroke-width", 1)
        tooltip.select("#title")
        .text(`${Math.round(scaleXZ(pathX))}`)

        const aa = Math.round(scaleXZ(pathX))
        for (let i = 0; i < data.length; i += 1){
          svg.select(`#${data[i].name}${Math.round(scaleXZ(pathX))}`)
            .attr("stroke-width", 2)
          tooltip.select(`#${data[i].name}`)
          .text(`${data[i].name}:${data[i].data[aa][1]}`)
        }
        tooltipLine.attr("transform", `translate(${padding.left + pathX},${padding.top})`)
        if (m[0] > padding.left && m[0] < pathwidth + padding.left && m[1] > padding.top && m[1] < pathheight + padding.top) {
          tooltip.style("visibility","visible")
          if (m[0] > padding.left&& m[0]<pathwidth-60) {
            tooltip.style("left",`${m[0]+60}px`)
          } else {
            tooltip.style("left",`${m[0]-60}px`)
          }
          if (m[1] > padding.top&& m[1]<pathheight-40) {
            tooltip.style("top",`${m[1]+110}px`)
          } else {
            tooltip.style("top",`${m[1]}px`)
          }
        } else {
          tooltip.style("visibility","hidden")
        }
      })
      .on("mouseout", function () {
        tooltipLine.style("opacity",0)
      })


    // y轴
    const axisY = svg.append("g")
      .attr("transform", `translate(${padding.left},${padding.top})`)
      .call(y)
    // X轴
    const axisX = svg.append("g")
      .attr("transform", `translate(${padding.left},${height - padding.bottom})`)
      .call(x)

    let line = {}
    const tooltip = this.tooltip(data)

    const tooltipLine =  this.tooltipLine(pathheight)

    function drowCircle(linedata, i) {
      const circleColor = linedata.color?linedata.color:color[i]
      svg.selectAll(`circle${linedata.name}`)
        .data(linedata.data)
        .enter()
        .append("circle")
        .attr("id", function (d) {
          console.log(d,linedata.name)
          return `${linedata.name}${d[0]}`
        })
        .attr("data", function (d) {
            return d[1]
          })
        .attr("cx", function (d) {
          return scaleX(d[0])
        })
        .attr("cy", function(d) {
          return scaleY(d[1])
        })
        .attr("r", 3)
        .attr("fill", circleColor)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("transform", `translate(${padding.left},${padding.top})`);
    }

    function drawLine(linedata, i) {
      const lineColor = linedata.color?linedata.color:color[i]
      line = svg.append("path")
        .style("fill", "none")
        .style("stroke", lineColor)
        .style("stroke-width", "2")
        .attr("d",  lineGengeator(linedata.data))
        .attr("transform", `translate(${padding.left},${padding.top})`)
      drowCircle(linedata,i)
    }
    function loopDrawLine(data) {
      for (let i = 0; i < data.length; i += 1){
        drawLine(data[i],i)
      }
    }
    loopDrawLine(data)

    this.axisColor(axisX, "#dddddd", "#dddddd","#dddddd")
    this.axisColor(axisY, "white", "#dddddd", "#dddddd")
  }

  axisColor=(axis,path,g,text)　=> {
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

  tooltipLine = (pathheight) => {
    const tooltipLine = d3.select("svg")
    .append("path")
    .style("fill", "none")
    .style("stroke", "#dddddd")
    .style("stroke-width", "1")
    .attr("d", `M0,0L0,${pathheight}`)
    .style("opacity",0)
    return tooltipLine
  }

  tooltip = (data) => {
    const tooltip = d3.select("#line")
      .append("div")
      .style("position", "absolute")
      .style("background-color", "rgba(255, 255, 255, 0.9)")
      .style("box-shadow", "rgb(174, 174, 174) 0px 0px 10px")
      .style("width", " 80px")
      .style("height", `${data.length*20+20}px`)
      .style("visibility","hidden")
        .style("opacity", 1)

    tooltip.append("div")
      .attr("id", "title")
    for (let i = 0; i < data.length; i += 1){
      tooltip.append("div")
      .attr("id",`${data[i].name}`)
    }
    return tooltip
  }

  render() {
    return (
      <div id = "line">
      </div>
    );
  }
}

export default Line;
