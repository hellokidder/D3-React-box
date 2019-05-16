import React, { Component } from 'react';
import { data2linedata } from '../utils/utils'
import * as d3 from 'd3';
import styles from './index.css'

class LineChart extends Component {
  componentDidMount() {
    const { data, axis, layout, line } = this.props;
    const width = layout.width?layout.width:1000;
    const height = layout.height ? layout.height : 500;
    const padding = { top: 40, left: 45, right: 40, bottom: 40 };
    const sliderable = layout.slider ? layout.slider : false
    const legendable = layout.legend ? layout.legend : false
    const tooltiplineable = layout.tooltipline!==undefined ? layout.tooltipline : true
    const tooltipable = layout.tooltip!==undefined?layout.tooltip:true
    const curve = layout.curve ? layout.curve : false
    const color = ["#1890FF", "#2FC25B", "#FACC14", "#223273", "#8543E0","#13C2C2","#3436C7","#F04864"]
    const lineConfig = {
      width: 2,
      linecap: "round",
      linejoin:"round",
      unit:""
      }
    if(sliderable) padding.bottom += 30
    if(legendable) padding.bottom += 20


    const axisConfig = {}
    const keys = Object.keys(data[0])
    axisConfig.X = axis?( axis.x ? axis.x : keys[0]) : keys[0]
    keys.splice(keys.indexOf(axisConfig.X),1)
    axisConfig.Y = axis ? (axis.y ? axis.y : keys) : keys


    const pathwidth = width - padding.left - padding.right
    const pathheight = height - padding.top - padding.bottom


    const lineData = data2linedata(data, axisConfig.Y)
    function setlineData() {
      const { width, linecap, linejoin, unit } = lineConfig
      for (let i = 0; i < lineData.length; i += 1){
        lineData[i].width = width
        lineData[i].click = false
        lineData[i].linecap = linecap
        lineData[i].linejoin = linejoin
        lineData[i].unit = unit
        lineData[i].rander = [0,data.length]
        if (color[i]) {
          lineData[i].color =color[i]
        } else {
          const colorRound = '#'+Math.floor(Math.random()*256).toString(16)+Math.floor(Math.random()*256).toString(16)+Math.floor(Math.random()*256).toString(16)
          lineData[i].color = colorRound
        }
      }
      if (line !== undefined) {
        for (let i = 0; i < lineData.length; i += 1){
          for (let n = 0; n < line.length; n += 1){
            if (line[n].name === lineData[i].name) {
              if (line[n].unit) lineData[i].unit = line[n].unit
              if (line[n].width) lineData[i].width = line[n].width
              if (line[n].color) lineData[i].color = line[n].color
              if (line[n].linecap) lineData[i].linecap = line[n].linecap
              if (line[n].linejoin) lineData[i].linejoin = line[n].linejoin
            }
          }
        }
      }
    }
 setlineData()

    function findMinMax(lineData) {
      let dataArr = []
      const minMax = {}
      for (let i = 0; i < lineData.length; i+=1){
        if (!lineData[i].click){
          dataArr = dataArr.concat(lineData[i].data)
        }
      }
      minMax.min = d3.min(dataArr)
      minMax.max = d3.max(dataArr)
      return minMax
    }
    const minMaxXY = findMinMax(lineData)




    const svg = d3.select("#linesvg")
      .attr("width", width)
    .attr("height",height)
    const scaleXData = []
    for (let i = 0; i < data.length; i += 1){
      scaleXData.push(data[i][axisConfig.X])
    }
    // 放大器
    const scaleX = d3.scalePoint()
      .domain(scaleXData)
      .range([0, pathwidth])
    const xpoint = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0,pathwidth])
    const scaleY = d3.scaleLinear()
      .domain([minMaxXY.min,minMaxXY.max]).nice()
      .range([pathheight, 0])
  //   // 轴线生成×××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
    // 线条生成器
    const x = d3.axisBottom(scaleX)
    const y = d3.axisLeft(scaleY)
  //   // y轴
    const axisY = svg.append("g")
    .attr("id","axisY")
    .attr("transform", `translate(${padding.left},${padding.top})`)
      .call(y)
      // egg
      // .append("text")
      // .attr("fill", "#000")
      // .attr("transform", "rotate(-90)")
      // .attr("y",6)
      // .attr("dy", "0.9em")
      // .attr("text-anchor", "end")
      // .text("hello kidder!");
      // X轴
      const axisX = svg.append("g")
      .attr("id","axisX")
      .attr("transform", `translate(${padding.left},${pathheight + padding.top})`)
        .call(x)

  // // 折线生成×××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
    const lineGengeator = d3.line()
      .x(function (d,i) {
        return xpoint(i)
      })
      .y(function (d) {
        return scaleY(d)
      })
      if (curve) {
        lineGengeator.curve(d3.curveCardinal)
      }
      svg.append('defs')
      .append('clipPath') // 添加长方形方块，遮罩作用
      .attr('id', 'clip')
      .append('rect')
      .attr('height', height)
      .attr('width', 0) // 用遮罩实现线动画
      .transition()
      .duration(1000)
      .attr('width', width)
    for (let i = 0; i < lineData.length; i += 1){
      this.drawLine(lineData[i], svg, lineGengeator, padding)
    }

  //   // tooltipline***********************************************************************
    let tooltipLine = {}
    if (tooltiplineable) {
      tooltipLine = this.tooltipLine(pathheight)
    }
  //   // tooltip***************************************************************************
    let tooltip = {}
    if (tooltipable) {
      tooltip = this.setTooltip(lineData)
    }
  //   // 对画布添加鼠标事件方法+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    if (tooltiplineable || tooltipable) {
      this.setSvgMouse(lineData,data,svg,axisConfig,tooltipLine,tooltip,padding,pathwidth,pathheight,tooltiplineable,tooltipable)
    }
  //   // legend****************************************************************************
    if (legendable) {
      this.setLegend(sliderable,height,padding, lineData ,svg, pathwidth,axisY,findMinMax,curve)
    }
  //   // slider****************************************************************************
    if (sliderable) {
      this.setSlider(padding,pathwidth,height,axisX,axisY,axisConfig,findMinMax,curve,lineData,this,data)
    }
  }

  setSvgMouse = (lineData,data,svg,axisConfig,tooltipLine,tooltip,padding,pathwidth,pathheight,tooltiplineable, tooltipable) => {
    svg.on("mousemove", function () {
      const m = d3.mouse(this)
      if (m[0] - padding.left > 0 && m[0] - padding.left < pathwidth && m[1] > padding.top && m[1] < pathheight + padding.top) {
        const dataLength = lineData[0].rander[1]-lineData[0].rander[0]
        const roundX = Math.round((m[0] - padding.left) / (pathwidth / (dataLength - 1)))
        const pathX = roundX * (pathwidth / (dataLength - 1))
        const xpoint = d3.scaleLinear()
        .domain([0,pathwidth])
        .range([0, dataLength - 1])
        const countX = Math.round(xpoint(pathX))
        if (tooltiplineable) {
          tooltipLine.style("opacity",1)
          tooltipLine.attr("transform", `translate(${padding.left + pathX},${padding.top})`)
        }
        if (tooltipable) {
          tooltip.select("#title")
            .text(`${data[countX+lineData[0].rander[0]][axisConfig.X]}`)
          for (let i = 0; i < lineData.length; i += 1){
            // 将选中区域数据添加到toolTip
            if (lineData[i].click) {
              tooltip.select(`#tooltip${lineData[i].name}`)
                .style("height", "0px")
              tooltip.select(`#${lineData[i].name}dot`)
              .style("height", "0px")
              tooltip.select(`#${lineData[i].name}key`)
                .text('')
              tooltip.select(`#${lineData[i].name}val`)
                .text('')
            } else {
              tooltip.select(`#tooltip${lineData[i].name}`)
              .style("height", "20px")
              tooltip.select(`#${lineData[i].name}dot`)
              .style("height", "8px")
              tooltip.select(`#${lineData[i].name}key`)
                .text(`${lineData[i].name}:`)
              tooltip.select(`#${lineData[i].name}val`)
                .text(`${lineData[i].data[countX+lineData[0].rander[0]]}${lineData[i].unit}`)
            }
          }
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
        }
      } else {
        if (tooltiplineable) {
          tooltipLine.style("opacity",0)
        }
        if (tooltipable) {
          tooltip.style("visibility","hidden")
        }
      }
    })
    .on("mouseout", function () {
      if (tooltiplineable) {
        tooltipLine.style("opacity",0)
      }
      if (tooltipable) {
        tooltip.style("visibility","hidden")
      }
    })
  }
  setTooltip = (lineData) => {
    // const { renderLineData:data } = linechart.state
    const tooltip = d3.select("#linechart")
      .append("div")
      .attr("id","tooltip")
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

    const ul = tooltip.append("div")
      .style("margin", "0px")
      .style("padding","0px")

    for (let i = 0; i < lineData.length; i += 1){
      if (!lineData[i].click) {
        const tip = ul.append("div")
          .attr("id", `tooltip${lineData[i].name}`)
          .style("text-align"," left")

        const name = tip.append("div")
          .style("display", "inline-block")
          .style("text-align"," left")

        const dot = name.append("div")
          .style("display", "inline-block")
          .style("width", "8px")
          .style("height","20px")
          dot.append("div")
          .style("display", "inline-block")
          .style("border-radius", "50%")
          .style("background-color", lineData[i].color)
          .style("margin-right", "0px")
          .style("padding-right", "0px")
          .style("width", "8px")
          .style("height","8px")
          .attr("id", `${lineData[i].name}dot`)
        name.append("div")
          .style("display", "inline-block")
          .style("margin-left","5px")
          .attr("id", `${lineData[i].name}key`)
        tip.append("div")
          .style("display", "inline-block")
          .attr("id", `${lineData[i].name}val`)
          .style("margin-left", "30px")
          .style("float","right")
      }
    }
    return tooltip
  }
  setSlider = (padding, pathwidth, height,axisX,axisY,axisConfig,findMinMax,curve,lineData,lineChart,data) => {
    const top = height - 30
    let x = padding.left
    let y = padding.left + pathwidth
    let roomPoint = 0

    const dragx = d3.drag()
    .on("drag", function (d) {
      const m = d3.mouse(this)
      if (m[0] >= padding.left && m[0] <= padding.left + pathwidth) {
        x = m[0]
        d3.select(this)
          .transition()
          .duration(1)
          .attr("x", m[0] - 3)
        dragxy(m)
      }
    })
    .on("end", function () {
      dragEnd()
    })
    const dragy = d3.drag()
    .on("drag",function (d) {
      const m = d3.mouse(this)
      if (m[0] >= padding.left && m[0] <= (padding.left + pathwidth)) {
        y = m[0]
        d3.select(this)
        .transition()
        .duration(1)
        .attr("x", m[0] - 3)
        dragxy(m)
      }
    })
    .on("end", function () {
        dragEnd()
    })

    function dragxy(m) {
      // 改变选中区域
      room.transition()
        .duration(1)
        .attr("x", x<y?x:y)
      .attr("width", x<y?y-x:x-y)
    }
    function dragEnd() {
      if (x > y) {
        // 确保sliderLeft的坐标为较小数
        [x, y] = [y, x]
        sliderLeft.attr("x", x - 3)
        sliderRight.attr("x", y - 3)
      }
      const unScaleX = d3.scaleLinear()
      .domain([0,pathwidth])
      .range([0, data.length - 1])
      const roomX = Math.ceil(unScaleX(x - padding.left-10))
      const roomY = Math.floor(unScaleX(y - padding.left+10))
      const newData = data.slice(roomX, roomY + 1)
      const newScaleX = []
      for (let i = 0; i < newData.length; i += 1){
        newScaleX.push(newData[i][axisConfig.X])
      }
      const minMaxXY = findMinMax(lineData)
      const scaleX = d3.scalePoint()
      .domain(newScaleX)
        .range([0, pathwidth])
      const scaleY = d3.scaleLinear()
      .domain([minMaxXY.min,minMaxXY.max]).nice()
        .range([height - padding.top - padding.bottom, 0])
      const axisx = d3.axisBottom(scaleX)
      const axisy = d3.axisLeft(scaleY)
      const xpoint = d3.scaleLinear()
      .domain([0, newData.length - 1])
        .range([0, pathwidth])

        const newlineGengeator = d3.line()
      .x(function (d,i) {
        return xpoint(i)
      })
      .y(function (d) {
        return scaleY(d)
      })
      if (curve) {
        newlineGengeator.curve(d3.curveCardinal)
      }
      axisX.transition()
      .duration(1000)
        .call(axisx)
      axisY.transition()
      .duration(1000)
        .call(axisy)
      for (let i = 0; i < lineData.length; i += 1){
        lineData[i].rander = [roomX,roomY+1]
        if (!lineData[i].click) {
          d3.select(`#${lineData[i].name}`)
          .transition()
            .duration(1000)
            .attr("d", newlineGengeator(lineData[i].data.slice(roomX, roomY + 1)))
        }
      }
    }

    const dragRoom = d3.drag()
    .on("start", function () {
      const m = d3.mouse(this)
      roomPoint = m[0]
    })
    .on("drag", function () {
      const m = d3.mouse(this)
      const move = m[0] - roomPoint
      const roomWidth = y - x
      let dragX = x + move
      let dragY = y + move
      if (dragX < padding.left) {
        dragX = padding.left
        dragY = roomWidth + padding.left
      } else if (dragY > padding.left + pathwidth) {
        dragY = padding.left + pathwidth
        dragX = padding.left + pathwidth - roomWidth
      }
      d3.select(this)
        .transition()
        .duration(1)
        .attr("x", dragX)
      sliderLeft.transition()
        .duration(1)
        .attr("x", dragX - 3)
      sliderRight.transition()
      .duration(1)
      .attr("x",dragY - 3)
    })
    .on("end", function () {
      const m = d3.mouse(this)
      const move = m[0] - roomPoint
      const roomWidth = y - x
      let dragX = x + move
      let dragY = y + move
      if (dragX < padding.left) {
        dragX = padding.left
        dragY = roomWidth + padding.left
      } else if (dragY > padding.left + pathwidth) {
        dragY = padding.left + pathwidth
        dragX = padding.left + pathwidth - roomWidth
      }
      x = dragX
      y = dragY
      dragEnd()
    })
    const slider = d3.select("#linechart")
      .append("div")
      .attr("id","slider")
      .style("position", "absolute")
      .style("background-color", "rgba(255, 255, 255, 0.9)")
      .style("box-shadow", "rgb(174, 174, 174) 0px 0px 10px")
      .style("left",`${padding.left}px`)
      .style("top",`${top}px`)
      .style("border-radius","3px")
      .style("font-size", "12px")
      .style("width",`${y-x}px`)
      .style("height", "20px")

    const sliderSvg = slider.append("svg")
      .attr("width", pathwidth+padding.left+padding.right)
      .attr("height", "20px")
      .attr("transform", `translate(${-padding.left},${0})`)

    lineChart.drawSliderLine(sliderSvg, lineData[0], curve, pathwidth, "20", findMinMax,padding)
    const room =  sliderSvg.append("rect")
      .attr("x", x)
      .attr("y", 0)
      .attr("height", 20)
      .attr("width", y-x)
      .style("fill", "#cddaef")
      .style("stroke", "#a3afc3")
      .style("opacity", 0.5)
      .style("cursor", "move")
      .call(dragRoom)

    const sliderLeft = sliderSvg.append("rect")
      .attr("x", x-3)
      .attr("y", 4)
      .attr("height", 12)
      .attr("width", 6)
      .style("fill","none")
      .style("stroke", "#a3afc3")
      .style("stroke-width", 3)
      .style("cursor", "ew-resize")
      .call(dragx)
    const sliderRight = sliderSvg.append("rect")
      .attr("x", y-3)
      .attr("y", 4)
      .attr("height", 12)
      .attr("width", 6)
      .style("fill","none")
      .style("stroke", "#a3afc3")
      .style("stroke-width", 3)
      .style("cursor", "ew-resize")
      .call(dragy)
  }

  drawSliderLine = (sliderSvg, line, curve, pathwidth,pathheight,findMinMax,padding) => {
    const minMaxXY = findMinMax([line])
    const scaleX = d3.scaleLinear()
    .domain([0, line.data.length - 1])
    .range([0,pathwidth])
  const scaleY = d3.scaleLinear()
    .domain([minMaxXY.min,minMaxXY.max]).nice()
    .range([pathheight, 0])
    const lineGengeator = d3.line()
    .x(function (d,i) {
      return scaleX(i)
    })
    .y(function (d) {
      return scaleY(d)
    })
    if (curve) {
      lineGengeator.curve(d3.curveCardinal)
    }
    sliderSvg.append('path')
    .attr("id", `sliderLine`)
    .style("fill", "none")
    .attr('clip-path', 'url(#clip)')
    .style("stroke", "#979aa0")
    .style("stroke-width", 1)
    .attr("d",  lineGengeator(line.data))
    .attr("transform", `translate(${padding.left},${0})`)
  }



  tooltipLine = (pathheight) => {
    const tooltipLine = d3.select("#linesvg")
    .append("path")
    .style("fill", "none")
    .style("stroke", "#dddddd")
    .style("stroke-width", "1")
    .attr("d", `M0,0L0,${pathheight}`)
    .style("opacity",0)
    return tooltipLine
  }
  drawLine = (linedata, svg, lineGengeator, padding) => {
    svg.append("path")
      .attr("id", linedata.name)
      .style("fill", "none")
      .attr('clip-path', 'url(#clip)')
      .style("stroke", linedata.color)
      .style("stroke-width", linedata.width)
      .style("stroke-linecap",linedata.linecap)
      .style("stroke-linejoin",linedata.linejoin)
      .attr("d",  lineGengeator(linedata.data))
      .attr("transform", `translate(${padding.left},${padding.top})`)
  }

  setLegend = (sliderable, height, padding, lineData ,svg, pathwidth,axisY,findMinMax,curve) => {
    let transformHeight = sliderable ? height - 50 : height-20
      const legend = svg.append("g")
        .attr("transform", `translate(${padding.left},${transformHeight})`)
      const legendLength = pathwidth / lineData.length / 2
      const mid = pathwidth/2-legendLength*(lineData.length-1)/2
      for (let i = 0; i < lineData.length; i += 1){
        legend.append("path")
          .attr("d", `M0,0L10,0`)
          .style("fill", "none")
          .style("stroke", lineData[i].color)
          .style("stroke-width", lineData[i].width)
          .style("stroke-linecap", lineData[i].linecap)
          .attr("transform", `translate(${i * legendLength + mid},${-6})`)
        legend.append("text")
          .text(lineData[i].name)
          .style("font-size", "16px")
          .style("fill", "#8b8b8b")
          .style("cursor", "pointer")
          .attr("id", `mouse#${lineData[i].name}`)
          .attr("x", i * legendLength + 15 + mid)
          .on("mouseover", function () {
            if (!lineData[i].click) {
              mouseOver(i)
            }
          })
          .on("mouseout", function () {
            mouseOut(i)
          })
          .on("click", function (d) {
            lineData[i].click = !lineData[i].click
            renderClick()
          })
      }
    function renderClick() {
      const minMaxXY = findMinMax(lineData)
      const scaleY = d3.scaleLinear()
        .domain([minMaxXY.min,minMaxXY.max]).nice()
        .range([height - padding.top - padding.bottom, 0])
      const axisy = d3.axisLeft(scaleY)
      axisY.transition()
        .duration(1000)
        .call(axisy)
      const scaleX = d3.scaleLinear()
        .domain([0, lineData[0].rander[1]-lineData[0].rander[0]-1])
        .range([0, pathwidth])
      const newlineGengeator = d3.line()
        .x(function (d,i) {
          return scaleX(i)
        })
        .y(function (d) {
          return scaleY(d)
        })
      if (curve) {
        newlineGengeator.curve(d3.curveCardinal)
      }
      for (let i = 0; i < lineData.length; i += 1){
        if (!lineData[i].click) {
          const { rander } = lineData[i]
          d3.select(`#${lineData[i].name}`)
          .transition()
          .duration(1000)
            .attr("d", newlineGengeator(lineData[i].data.slice(rander[0], rander[1])))
        } else {
          d3.select(`#${lineData[i].name}`)
          .transition()
          .duration(1000)
          .attr("d","")
          }
        }
      }
    function mouseOver(i) {
        for (let n = 0; n < lineData.length; n += 1){
          svg.select(`path#${lineData[n].name}`)
            .style("opacity", 0.2)
          }
        svg.select(`path#${lineData[i].name}`)
          .style("opacity",1)
          .style("stroke-width", lineData[i].width + 1)
      }
      function mouseOut(i) {
        for (let n = 0; n < lineData.length; n += 1){
          svg.select(`path#${lineData[n].name}`)
            .style("opacity", 1)
            .style("stroke-width", lineData[i].width)
        }
      }
  }
  render() {
    return (
      <div id="linechart" style={{ display: "inline-block", position: "relative" }} >
        <svg id="linesvg" />
      </div>
    );
  }
}

export default LineChart;
