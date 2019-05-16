import React, { Component } from 'react';
import * as d3 from 'd3';
import styles from './index.css'

class BarChart extends Component {
  componentDidMount() {
    const { data, layout } = this.props;
    const padding = { top: 40, left: 45, right: 40, bottom: 40 };
    const color = ["#1890FF", "#2FC25B", "#FACC14", "#223273", "#8543E0","#13C2C2","#3436C7","#F04864"]
    const width = layout.width?layout.width:1000;
    const height = layout.height ? layout.height : 500;
    const pathheight = height - padding.top - padding.bottom
    const pathwidth = width - padding.left - padding.right
    const tooltipable = layout.tooltip !== undefined ? layout.tooltip : true
    const barwidth = layout.barwidth?layout.barwidth:"default"


    const svg = d3.select("#barsvg")
    .attr("width", width)
    .attr("height",height)
    const dataArr = []
    const nameArr = []
    for (let i = 0; i < data.length; i += 1){
      dataArr.push(data[i].data)
      nameArr.push(data[i].name)
    }
     // 放大器
    const scaleY = d3.scaleLinear()
      .domain([0,d3.max(dataArr)]).nice()
      .range([pathheight, 0])
    const scaleX = d3.scaleBand()
    .domain(nameArr)
    .range([0,pathwidth])

    const y = d3.axisLeft(scaleY)
    const x = d3.axisBottom(scaleX)

    // 定义 Bar 的宽度
    let barwid = 0
    if (barwidth === "default" || barwidth> scaleX.bandwidth()) {
      barwid = scaleX.bandwidth() / 3
    } else {
      barwid = barwidth
    }

    // y 轴
    svg.append("g")
      .attr("id","axisY")
      .attr("transform", `translate(${padding.left},${padding.top})`)
      .call(y)

    // x 轴
    svg.append("g")
    .attr("id","axisX")
      .attr("transform", `translate(${padding.left},${pathheight + padding.top})`)
      .call(x)
    if (tooltipable) {
      // 定义 Bar 阴影宽度
      let backwidth = 0
      if (barwid > scaleX.bandwidth() * 2 / 3) {
        backwidth = scaleX.bandwidth()
      } else {
        backwidth = scaleX.bandwidth() * 2 / 3
      }
      // bar 阴影
      svg.selectAll(".back")
      .data(data)
      .enter()
        .append("rect")
        .attr("id",function(d){
          return `back${d.name}`
      }).attr("class","back")
      .attr("transform", `translate(${padding.left+scaleX.bandwidth()/2},${padding.top})`)
      .attr("x", function(d,i){
          return scaleX(d.name) - backwidth/2;
      } )
      .attr("fill", "#f0f0f0")
      .style("opacity", 0)
      .attr("width", backwidth )
      .attr("height", function (d) {
        return pathheight
      });
    }

    // bar
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("transform", `translate(${padding.left+scaleX.bandwidth()/2},${padding.top})`)
      .attr("x", function(d,i){
          return scaleX(d.name) - barwid/2;
      } )
      .attr("y",function(d){
          return scaleY(d.data);
      })
      .attr("fill",color[0])
      .attr("width", barwid)
      .attr("height", function (d) {
        return 0
      })
      .transition()
      .duration(1000)
      .attr("height", function (d) {
        return pathheight-scaleY(d.data);
      });

    // tooltip
    let tooltip ={ }
    if (tooltipable) {
      tooltip =  this.setTooltip()
    }


    if (tooltipable) {
      this.setSvgMouse(svg,pathwidth,pathheight,padding,data,tooltip)
    }
  }

  setSvgMouse = (svg, pathwidth, pathheight, padding, data,tooltip) => {

    svg.on("mousemove", function () {
      const m = d3.mouse(this)
      if (m[0] - padding.left > 0 && m[0] - padding.left < pathwidth && m[1] > padding.top && m[1] < pathheight + padding.top) {
        // 根据鼠标位置显示阴影
        const scale = d3.scaleLinear()
        .domain([0,pathwidth])
          .range([0, data.length])
        const count = Math.floor(scale(m[0] - padding.left))
        svg.selectAll(`.back`)
        .style("opacity", 0)
        svg.select(`rect#back${data[count].name}`)
          .style("opacity", 1)

        // 向tooltip中添加数据
        tooltip.select(`#tooltipkey`)
        .text(`${data[count].name}:`)
        tooltip.select(`#tooltipval`)
          .text(`${data[count].data}`)

        // toolTip 跟随鼠标并限制在SVG区域
        const tool = document.getElementById("tooltip")
        if (m[0] > padding.left&& m[0]<(pathwidth+padding.left)-(tool.offsetWidth+15)) {
          tooltip.style("left",`${m[0]+15}px`)
        } else {
          tooltip.style("left",`${m[0]-15-tool.offsetWidth}px`)
        }
        if (m[1] > padding.top&& m[1]<(pathheight+padding.top)-(tool.offsetHeight+15)) {
          tooltip.style("top",`${m[1]+15}px`)
        } else {
          tooltip.style("top",`${m[1]-15-tool.offsetHeight}px`)
        }
        tooltip.style("visibility","visible")
      } else {
      tooltip.style("visibility","hidden")
      }
    })
    .on("mouseout", function () {
      svg.selectAll(`.back`)
        .style("opacity", 0)
      tooltip.style("visibility","hidden")
    })
  }

  setTooltip = () => {
    const tooltip = d3.select("#Bar")
      .append("div")
      .attr("id","tooltip")
      .style("position", "absolute")
      .style("background-color", "rgba(255, 255, 255, 0.9)")
      .style("box-shadow", "rgb(174, 174, 174) 0px 0px 10px")
      .style("border-radius","3px")
      .style("padding", "6px 10px")
      .style("color", "rgb(87, 87, 87)")
      .style("font-size","12px")
      .style("line-height","20px")
      .style("visibility","hidden")
      .style("opacity", 1)
      tooltip.append("div")
      .style("display", "inline-block")
      .attr("id", `tooltipkey`)
      tooltip.append("div")
      .style("display", "inline-block")
      .attr("id", `tooltipval`)
      .style("margin-left", "30px")
      .style("float","right")
    return tooltip
  }
  render() {
    return (
      <div id="Bar" style={{ display: "inline-block", position: "relative" }}>
        <svg id="barsvg" />
      </div>
    );
  }
}

export default BarChart;
