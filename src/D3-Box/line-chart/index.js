import React, { Component } from 'react';
import * as d3 from 'd3';

class LineChartD3 extends Component {

  componentWillMount() {
  }
  componentDidMount() {
    const { data } = this.props
    console.log(data)
    const width = 1000
    const height = 500
    const padding = { top: 40, left: 40, right: 40, bottom: 40 }
    const pathwidth = width - padding.left - padding.right
    const pathheight = height - padding.top - padding.bottom

    // 放大器
    var scaleX = d3.scaleLinear()
      .domain([0,data.length-1]).nice()
      .range([0, pathwidth])

    var scaleY = d3.scaleLinear()
      .domain([0,d3.max(data)]).nice()
      .range([ pathheight,0])

    var lineGengeator = d3.line()
      .x(function (d, i) {
        return scaleX(i)
      })
      .y(function (d) {
        return scaleY(d)
      })

    const x = d3.axisBottom(scaleX)
    const y = d3.axisLeft(scaleY)

    const tooltip = d3.select("#line")
      .append("div")
      .style("position", "absolute")
      .style("border-style","outset")
      .style("background-color", "cadetblue")
      .style("width", " 80px")
      .style("height", "50px")
      .style("opacity",0)

    d3.select("#line")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    // 背景
      d3.select("svg")
      .append("rect")
      .attr("x", padding.left)
      .attr("y",padding.top)
      .attr("width", pathwidth)
      .attr("height", pathheight)
      .attr("fill", "white")
      .on("mouseover", function () {
        tooltipLine.style("opacity",1)
      })
      .on("mousemove", function (d) {
        const m = d3.mouse(this)
        tooltipLine.attr("transform", `translate(${padding.left + (pathwidth / (data.length - 1)) * Math.round( (m[0]-padding.left) / (pathwidth / (data.length-1)))},${padding.bottom})`)
      })
      .on("mouseout", function () {
        tooltipLine.style("opacity",0)
      })

      // y轴
      d3.select("svg")
      .append("g")
      .attr("id","yyyy")
      .attr("transform", `translate(${padding.left},${padding.top})`)
      .call(y)
      // X轴
      d3.select("svg")
        .append("g")
        .attr("id","xxxx")
        .attr("transform", `translate(${padding.left},${height - padding.bottom})`)
        .call(x)

      d3.select("#xxxx > path")
        .attr("stroke", "#dddddd")
        .attr("stroke-width", "2")

    d3.select("#xxxx")
      .selectAll("g")
      .select("line")
      .attr("stroke", "#dddddd")
      .attr("stroke-width", "1")

      d3.select("#yyyy > path")
      .attr("stroke", "white")
      .attr("stroke-width", "2")

      d3.select("#yyyy")
      .selectAll("g")
      .select("line")
      .attr("stroke", "white")
      .attr("stroke-width", "1")

    const tooltipLine = d3.select("svg")
      .append("path")
      .style("fill", "none")
      .style("stroke", "#dddddd")
      .style("stroke-width", "1")
      .attr("d", `M0,0L0,${pathheight}`)
      .style("opacity",0)



    // 折线
    d3.select("svg")
      .append("path")
      .style("fill", "none")
      .style("stroke", "#008ffa")
      .style("stroke-width", "2")
      .attr("d", lineGengeator(data))
      .attr("transform", `translate(${padding.left},${padding.top})`)
      .on("mousemove", function (d) {
        const m = d3.mouse(this)
        const datax = m[0] * (data.length / pathwidth)
        const round = Math.round(datax)
        if (Math.abs(round - datax) < 0.3) {
          tooltip
            .text(`${round}:${data[round]}`)
            .style("left",`${m[0]+50}px`)
            .style("top",`${m[1]-20}px`)
            .style("opacity",1)

        } else {
          tooltip
          .style("opacity",0)
        }
      })
    .on("mouseout", function () {
      tooltip.style("opacity",0)
    })

  }
  render() {
    return (
      <div id = "line" style={{position:"relative"}}>
      </div>
    );
  }
}

export default LineChartD3;
