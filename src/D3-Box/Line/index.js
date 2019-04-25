import React, { Component } from 'react';
import * as d3 from 'd3';
import { lineConfig } from '../config/config'
import { findMinMax,data2linedata } from '../utils/utils'

class Line extends Component {

  componentDidMount() {
    const { data, axis, layout, dot, tooltip, tooltipline } = this.props;
    let padding = lineConfig.padding
    let width = lineConfig.width
    let height = lineConfig.height
    let dotable = true
    let tooltipable = false
    let tooltipLineable = false
    let axisXY = lineConfig.axis
    const color = lineConfig.color
    const thisaxis = {}
    const keys = Object.keys(data[0])
    thisaxis.X = axis.x ? axis.x : keys[0]
    keys.splice(keys.indexOf(thisaxis.X),1)
    thisaxis.Y = axis.y ? axis.y : keys;
    if (layout !== undefined) {
      padding = layout.padding ? layout.padding : lineConfig.padding
      width = layout.width ? layout.width : lineConfig.width
      height = layout.height ? layout.height : lineConfig.height
    }
    const pathwidth = width - padding.left - padding.right
    const pathheight = height - padding.top - padding.bottom

    const minMaxY = findMinMax(data, thisaxis)
    const lineData = data2linedata(data, thisaxis.Y)
    if (pathwidth / data.length < 10) {
      dotable = false
    }
    if (dot !== undefined) {
      dotable = dot
    }

    if (tooltip !== undefined) {
      tooltipable = tooltip
      tooltipLineable = tooltipline
    }
      function setaxis(theaxis) {
      if (axis[theaxis]) {
        if (axis[theaxis].path) {
          axisXY[theaxis].path = axis[theaxis].path
        }
        if (axis[theaxis].pathwidth) {
          axisXY[theaxis].pathwidth = axis[theaxis].pathwidth
        }
        if (axis[theaxis].tick) {
          axisXY[theaxis].tick = axis[theaxis].tick
        }
        if (axis[theaxis].tickwidth) {
          axisXY[theaxis].tickwidth = axis[theaxis].tickwidth
        }
        if (axis[theaxis].text) {
          axisXY[theaxis].text = axis[theaxis].text
        }
      }
    }
    setaxis("axisX");
    setaxis("axisY")

    console.log(lineData)

    // 放大器
    var scaleX = d3.scaleLinear()
      .domain([0,data.length-1])
      .range([0, pathwidth])
    var scaleY = d3.scaleLinear()
      .domain([minMaxY.min,minMaxY.max]).nice()
      .range([pathheight, 0])
    // X轴缩小器
      var　scaleXZ = d3.scaleLinear()
      .domain([0,pathwidth])
      .range([0, data.length-1])

    // 线条生成器
    var lineGengeator = d3.line()
      .x(function (d,i) {
        return scaleX(i)
      })
      .y(function (d, i) {
        if( i === 99)
        console.log(scaleY(d),d)
        return scaleY(d)
      })

    const x = d3.axisBottom(scaleX)
    const y = d3.axisLeft(scaleY)

    const svg = d3.select("#line")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function () {
        if (tooltipLineable) {
          tooltipLine.style("opacity",1)
        }
      })
      .on("mouseout", function () {
        if (tooltipLineable) {
          tooltipLine.style("opacity",0)
        }
      })
      .on("mousemove", function () {
        const m = d3.mouse(this)
        const roundX = Math.round((m[0] - padding.left) / (pathwidth / (data.length - 1)))
        const pathX = roundX * (pathwidth / (data.length - 1))
        const countX = Math.round(scaleXZ(pathX))
        if (m[0] - padding.left > 0 && m[0] - padding.left < pathwidth && m[1] > padding.top && m[1] < pathheight + padding.top) {
          if (tooltipLineable) {
            tooltipLine.attr("transform", `translate(${padding.left + pathX},${padding.top})`)
          }
          // 初始化所有点的状态
          svg.selectAll("circle")
            .attr("stroke-width", 1)
          // 为toolTip 添加 title
          if (tooltipable) {
            toolTip.select("#title")
            .text(`${data[countX][thisaxis.X]}`)
            for (let i = 0; i < lineData.length; i += 1){
              // 选中点改变状态
              svg.select(`#${lineData[i].name}${Math.round(scaleXZ(pathX))}`)
                .attr("stroke-width", 2)
              // 将选中区域数据添加到toolTip
              toolTip.select(`#${lineData[i].name}key`)
                .text(`${lineData[i].name}:`)
              toolTip.select(`#${lineData[i].name}val`)
                .text(`${lineData[i].data[countX]}`)
            }
            // toolTip 跟随鼠标并限制在SVG区域
                if (m[0] > padding.left&& m[0]<pathwidth-60) {
                  toolTip.style("left",`${m[0]+60}px`)
                } else {
                  toolTip.style("left",`${m[0]-60}px`)
                }
                if (m[1] > padding.top&& m[1]<pathheight-40) {
                  toolTip.style("top",`${m[1]+110}px`)
                } else {
                  toolTip.style("top",`${m[1]}px`)
                }
                toolTip.style("visibility","visible")
          }
        } else {
          if (tooltipable) {
            toolTip.style("visibility","hidden")
          }
        }
      })


    // y轴
    const axisY = svg.append("g")
      .attr("transform", `translate(${padding.left},${padding.top})`)
      .call(y)
    // X轴
    const axisX = svg.append("g")
      .attr("transform", `translate(${padding.left},${height - padding.bottom})`)
      .call(x)

    this.axisColor(axisX, axisXY.axisX)
    this.axisColor(axisY, axisXY.axisY)

    // 修改X轴显示的数据
    axisX.selectAll("g")
    .selectAll("text")
    .text(function (d) {
      if (d < data.length) {
        return data[d][thisaxis.X]
      }
    })
      let tooltipLine = {}
      if (tooltipLineable) {
        tooltipLine = this.tooltipLine(pathheight)
      }
      let toolTip = {}
      if (tooltipable) {
        toolTip = this.tooltip(lineData,color)
      }

      function loopDrawLine(data) {
        for (let i = 0; i < data.length; i += 1){
          drawLine(data[i],i)
        }
      }

      function drawLine(linedata, i) {
        const lineColor = linedata.color ? linedata.color : color[i]
        svg.append("path")
          .style("fill", "none")
          .style("stroke", lineColor)
          .style("stroke-width", "2")
          .attr("d",  lineGengeator(linedata.data))
          .attr("transform", `translate(${padding.left},${padding.top})`)
        if (dotable) {
          drowCircle(linedata,i)
        }
      }
      function drowCircle(linedata, i) {
        const circleColor = linedata.color ? linedata.color:color[i]
        svg.selectAll(`circle${linedata.name}`)
          .data(linedata.data)
          .enter()
          .append("circle")
          .attr("id", function (d,i) {
            return `${linedata.name}${i}`
          })
          .attr("data", function (d) {
              return d
            })
          .attr("cx", function (d,i) {
            return scaleX(i)
          })
          .attr("cy", function(d) {
            return scaleY(d)
          })
          .attr("r", 3)
          .attr("fill", circleColor)
          .attr("stroke", "white")
          .attr("stroke-width", 1)
          .attr("transform", `translate(${padding.left},${padding.top})`);
      }
    loopDrawLine(lineData)


  }

  axisColor = (axis, axisXY) => {
    axis.select("path")
    .attr("stroke", axisXY.path)
    .attr("stroke-width", "2")
    axis.selectAll("g")
    .select("line")
    .attr("stroke", axisXY.tick)
      .attr("stroke-width", "1")
    axis.selectAll("g")
    .select("text")
    .attr("stroke", axisXY.text)
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

  tooltip = (data,color) => {
    const tooltip = d3.select("#line")
      .append("div")
      .style("position", "absolute")
      .style("background-color", "rgba(255, 255, 255, 0.9)")
      .style("box-shadow", "rgb(174, 174, 174) 0px 0px 10px")
      .style("border-radius","3px")
      .style("padding", "10px 10px 6px 10px")
      .style("color", "rgb(87, 87, 87)")
      .style("font-size","12px")
      .style("line-height","20px")
      .style("visibility","hidden")
      .style("opacity", 1)

    tooltip.append("div")
      .attr("id", "title")
      .style("text-align", "left")
      .style("margin-bottom","4px")

    const ul = tooltip.append("ul")
      .style("margin", "0px")
      .style("list-style-type", "none")
      .style("padding","0px")

    for (let i = 0; i < data.length; i += 1){
      const lineColor = data.color ? data.color : color[i]
      const tip = ul.append("li")
        .attr("id", `${data[i].name}`)

      const dot = tip.append("span")
        .style("display", "inline-block")
        .style("float","left")
        .style("width", "8px")
        .style("height","20px")
        dot.append("span")
        .style("display", "inline-block")
        .style("border-radius", "50%")
        .style("background-color", lineColor)
        .style("margin-right", "0px")
        .style("padding-right", "0px")
        .style("width", "8px")
        .style("height","8px")
        .attr("id", `${data[i].name}dot`)
      tip.append("span")
        .style("display", "inline-block")
        .style("margin-left","5px")
        .style("float","left")
        .attr("id", `${data[i].name}key`)
      tip.append("span")
        .style("display", "inline-block")
        .attr("id", `${data[i].name}val`)
        .style("margin-left", "30px")
        .style("float","right")
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
