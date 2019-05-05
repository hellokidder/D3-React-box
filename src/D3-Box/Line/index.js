import React, { Component } from 'react';
import * as d3 from 'd3';
import { lineConfig } from '../config/config'
import { findMinMax,data2linedata } from '../utils/utils'

class Line extends Component {

  componentDidMount() {
    // 初始化数据××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
    const { data, axis, layout, line } = this.props;
    let padding = lineConfig.padding
    let width = lineConfig.width
    let height = lineConfig.height
    let legend = lineConfig.legend
    let slider = lineConfig.slider
    let dotable = lineConfig.dotable
    let tooltipable = lineConfig.tooltipable
    let tooltiplineable = lineConfig.tooltiplineable
    let axisConfig = lineConfig.axis
    const color = lineConfig.color
    const keys = Object.keys(data[0])
    axisConfig.X = axis?( axis.x ? axis.x : keys[0]) : keys[0]
    keys.splice(keys.indexOf(axisConfig.X),1)
    axisConfig.Y = axis ? (axis.y ? axis.y : keys) : keys


    if (layout !== undefined) {
      if(layout.width) width = layout.width
      if(layout.height) height = layout.height
      if(layout.padding) padding = layout.padding
      if(layout.dot !== undefined) dotable = layout.dot
      if(layout.slider !== undefined) slider = layout.slider
      if(layout.legend !== undefined) legend = layout.legend
      if(layout.tooltip !== undefined) tooltipable = layout.tooltip
      if(layout.tooltipline !== undefined) tooltiplineable = layout.tooltipline
    }

    if(slider) padding.bottom += 30
    if(legend) padding.bottom += 20

    const pathwidth = width - padding.left - padding.right
    const pathheight = height - padding.top - padding.bottom

    const minMaxY = findMinMax(data, axisConfig)
    const lineData = data2linedata(data, axisConfig.Y)

    // 计算一个间距，当两个点小于此间距，dotable设为false
    if (pathwidth / data.length < 10) {
      dotable = false
    }

    function setaxis(xOrY) {
      // 初始化轴数据
      if (axis[xOrY]) {
        if (axis[xOrY].path) axisConfig[xOrY].path = axis[xOrY].path
        if (axis[xOrY].pathwidth) axisConfig[xOrY].pathwidth = axis[xOrY].pathwidth
        if (axis[xOrY].tick) axisConfig[xOrY].tick = axis[xOrY].tick
        if (axis[xOrY].tickwidth) axisConfig[xOrY].tickwidth = axis[xOrY].tickwidth
        if (axis[xOrY].text) axisConfig[xOrY].text = axis[xOrY].text
      }
    }
    if (axis) {
      setaxis("axisX")
      setaxis("axisY")
    }
    function setlineData() {
      // 初始化线数据
      const { width, linecap, linejoin, unit } = lineConfig.line
      for (let i = 0; i < lineData.length; i += 1){
        lineData[i].dot = dotable
        lineData[i].width = width
        lineData[i].click = false
        lineData[i].linecap = linecap
        lineData[i].linejoin = linejoin
        lineData[i].unit = unit
        if (lineConfig.color[i]) {
          lineData[i].color =lineConfig.color[i]
        } else {
          const colorRound = '#'+Math.floor(Math.random()*256).toString(16)+Math.floor(Math.random()*256).toString(16)+Math.floor(Math.random()*256).toString(16)
          lineData[i].color = colorRound
        }
      }
      for (let i = 0; i < lineData.length; i += 1){
        for (let n = 0; n < line.length; n += 1){
          if (line[n].name === lineData[i].name) {
            if (line[n].unit) lineData[i].unit = line[n].unit
            if (line[n].width) lineData[i].width = line[n].width
            if (line[n].color) lineData[i].color = line[n].color
            if (line[n].linecap) lineData[i].linecap = line[n].linecap
            if (line[n].dot !== undefined) lineData[i].dot = line[n].dot
            if (line[n].linejoin) lineData[i].linejoin = line[n].linejoin
          }
        }
      }
    }
    setlineData()
    // 绘图××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
    // 放大器
    const scaleX = d3.scaleLinear()
      .domain([0,data.length-1])
      .range([0, pathwidth])
    const scaleY = d3.scaleLinear()
      .domain([minMaxY.min,minMaxY.max]).nice()
      .range([pathheight, 0])
    // X轴反缩小器
    const　unScaleX = d3.scaleLinear()
      .domain([0,pathwidth])
      .range([0, data.length-1])

    // 线条生成器
    const lineGengeator = d3.line()
      .x(function (d,i) {
        return scaleX(i)
      })
      .y(function (d) {
        return scaleY(d)
      })


    function setXaxis(data) {
      const scale= d3.scaleLinear()
      .domain([0,data.length-1])
        .range([0, pathwidth])
      return  d3.axisBottom(scale)
    }
    const x = d3.axisBottom(scaleX)
    const y = d3.axisLeft(scaleY)

    const svg = d3.select("#line")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .on("mouseout", function () {
        if (tooltiplineable) {
          tooltipLine.style("opacity",0)
        }
        if (tooltipable) {
          toolTip.style("visibility","hidden")
        }
      })
      .on("mousemove", function () {
        const m = d3.mouse(this)
        const roundX = Math.round((m[0] - padding.left) / (pathwidth / (data.length - 1)))
        const pathX = roundX * (pathwidth / (data.length - 1))
        const countX = Math.round(unScaleX(pathX))
        // 画线区域
        if (m[0] - padding.left > 0 && m[0] - padding.left < pathwidth && m[1] > padding.top && m[1] < pathheight + padding.top) {
          if (tooltiplineable) {
            tooltipLine.style("opacity",1)
            tooltipLine.attr("transform", `translate(${padding.left + pathX},${padding.top})`)
          }
          // 初始化所有点的状态
          svg.selectAll("circle")
            .attr("stroke-width", 1)
          for (let i = 0; i < lineData.length; i += 1){
             // 选中点改变状态
             svg.select(`#${lineData[i].name}${Math.round(unScaleX(pathX))}`)
             .attr("stroke-width", 2)
          }
          if (tooltipable) {
            // 为toolTip 添加 title
            toolTip.select("#title")
              .text(`${data[countX][axisConfig.X]}`)
            for (let i = 0; i < lineData.length; i += 1){
              // 将选中区域数据添加到toolTip
              toolTip.select(`#${lineData[i].name}key`)
                .text(`${lineData[i].name}:`)
              toolTip.select(`#${lineData[i].name}val`)
                .text(`${lineData[i].data[countX]}${lineData[i].unit}`)
            }
            // toolTip 跟随鼠标并限制在SVG区域
            const tool = document.getElementById("tooltip")
                if (m[0] > padding.left&& m[0]<(width-padding.right)-(tool.offsetWidth+15)) {
                  toolTip.style("left",`${m[0]+15}px`)
                } else {
                  toolTip.style("left",`${m[0]-15-tool.offsetWidth}px`)
                }
                if (m[1] > padding.top&& m[1]<(height-padding.bottom)-(tool.offsetHeight+15)) {
                  toolTip.style("top",`${m[1]+15}px`)
                } else {
                  toolTip.style("top",`${m[1]-15-tool.offsetHeight}px`)
                }
              toolTip.style("visibility","visible")
          }
        } else {
          if (tooltiplineable) tooltipLine.style("opacity", 0)
          if (tooltipable) toolTip.style("visibility","hidden")
        }
      })


    // y轴
    const axisY = svg.append("g")
      .attr("transform", `translate(${padding.left},${padding.top})`)
      .call(y)
    // X轴
    const axisX = svg.append("g")
      .attr("id","axisX")
      .attr("transform", `translate(${padding.left},${height - padding.bottom})`)
      .call(x)

    this.axisColor(axisX, axisConfig.axisX)
    this.axisColor(axisY, axisConfig.axisY)

    // 修改X轴显示的数据
    axisX.selectAll("g")
    .selectAll("text")
    .text(function (d) {
      if (d < data.length) {
        return data[d][axisConfig.X]
      }
    })


    // 是否显示tooltipline
      let tooltipLine = {}
      if (tooltiplineable) {
        tooltipLine = this.tooltipLine(pathheight)
      }

    // 是否显示tooltip
      let toolTip = {}
      if (tooltipable) {
        toolTip = this.tooltip(lineData,color)
      }

    // 图例
    function setLegend(linedata) {
      let transformHeight = slider ? height - 50 : height-20
      const legend = svg.append("g")
        .attr("transform", `translate(${padding.left},${transformHeight})`)
      const legendLength = pathwidth / linedata.length / 2
      const mid = pathwidth/2-legendLength*(linedata.length-1)/2
      for (let i = 0; i < linedata.length; i += 1){
        legend.append("path")
          .attr("d", `M0,0L10,0`)
          .style("fill", "none")
          .style("stroke", linedata[i].color)
          .style("stroke-width", linedata[i].width)
          .style("stroke-linecap", linedata[i].linecap)
          .attr("transform", `translate(${i * legendLength + mid},${-6})`)
        legend.append("text")
          .text(linedata[i].name)
          .style("font-size", "16px")
          .style("fill", "#8b8b8b")
          .style("cursor","pointer")
          .attr("id",`mouse#${linedata[i].name}`)
          .attr("x", i * legendLength + 15 + mid)
          .on("mouseover", function () {
            mouseOver(i)
          })
          .on("mouseout", function () {
            mouseOut(i)
          })
          .on("click", function (d) {
            if (!linedata[i].click) {
              svg.select(`#${linedata[i].name}`)
                .attr("d", "")
              if (linedata[i].dot) {
                svg.selectAll(`.${linedata[i].name}`)
                .attr("r", 0)
              }
              linedata[i].click = true
            } else {
              svg.select(`#${linedata[i].name}`)
                .attr("d", lineGengeator(linedata[i].data))
              if (linedata[i].dot) {
                svg.selectAll(`.${linedata[i].name}`)
                .attr("r", 3)
              }
              linedata[i].click = false
            }
          })
      }
      function mouseOver(i) {
        for (let n = 0; n < linedata.length; n += 1){
          svg.select(`path#${linedata[n].name}`)
            .style("opacity", 0.2)
          }
        svg.selectAll("circle")
          .style("opacity", 0.2)
        svg.select(`path#${linedata[i].name}`)
          .style("opacity",1)
          .style("stroke-width", linedata[i].width + 1)
      }
      function mouseOut(i) {
        for (let n = 0; n < linedata.length; n += 1){
          svg.select(`path#${linedata[n].name}`)
            .style("opacity", 1)
            .style("stroke-width", linedata[i].width)
        }
        svg.selectAll("circle")
        .style("opacity", 1)
      }

    }
    if (legend) {
      setLegend(lineData)
    }


      function loopDrawLine(data) {
        for (let i = 0; i < data.length; i += 1){
          drawLine(data[i],i)
        }
      }

    function drawLine(linedata, i) {
      svg.append("path")
          .style("fill", "none")
          .style("stroke", linedata.color)
          .style("stroke-width", linedata.width)
          .style("stroke-linecap",linedata.linecap)
          .style("stroke-linejoin",linedata.linejoin)
          .style("stroke-dasharray", 1000000)
          .attr("id", linedata.name)
          .attr("d",  lineGengeator(linedata.data))
          .attr("transform", `translate(${padding.left},${padding.top})`)
          .attr("stroke-dashoffset", 1000000)
          .transition()
          .duration(10000)
          .attr("stroke-dashoffset", 0)

        if (linedata.dot) {
          drowCircle(linedata)
        }
      }
      function drowCircle(linedata) {
        svg.selectAll(`circle${linedata.name}`)
          .data(linedata.data)
          .enter()
          .append("circle")
          .classed(`${linedata.name}`, true)
          .attr("class",`${linedata.name}`)
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
          .attr("stroke", "white")
          .attr("stroke-width", 1)
          .attr("fill","#ffffff")
          .attr("transform", `translate(${padding.left},${padding.top})`)
          .transition()
          .duration(1000)
          .attr("fill", linedata.color)
      }
    loopDrawLine(lineData)
    if (slider) {
      this.setSlider(padding,pathwidth,height,unScaleX,lineData,svg,setXaxis)
    }
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
    .attr("fill", axisXY.text)
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

  setSlider = (padding, pathwidth, height,unScaleX,lineData,svg,setXaxis) => {
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
    function dragEnd() {
      if (x > y) {
        [x, y] = [y, x]
        sliderLeft.attr("x", x - 3)
        sliderRight.attr("x", y - 3)
      }
      const roomX = Math.ceil(unScaleX(x - padding.left))
      const roomY = Math.floor(unScaleX(y - padding.left))

          // 放大器
  //   const scaleX = d3.scaleLinear()
  //   .domain([0,data.length-1])
  //   .range([0, pathwidth])
  // const scaleY = d3.scaleLinear()
  //   .domain([minMaxY.min,minMaxY.max]).nice()
  //   .range([pathheight, 0])
  // // X轴反缩小器
  // const　unScaleX = d3.scaleLinear()
  //   .domain([0,pathwidth])
  //   .range([0, data.length-1])

  // // 线条生成器
  // const lineGengeator = d3.line()
  //   .x(function (d,i) {
  //     return scaleX(i)
  //   })
  //   .y(function (d) {
  //     return scaleY(d)
  //   })

      for (let i = 0; i < lineData.length; i += 1){
        const d = lineData[i].data.slice(roomX,roomY+1)
        svg.select(`#${lineData[i].name}`)
          .transition()
          .duration(1000)
          .attr("d", )
        svg.select("#axisX")
        .transition()
        .duration(1000)
        .call(setXaxis(d))
        console.log("x", x, "y", y,"unx",roomX,"uny",roomY,d)
      }
    }
    function dragxy(m) {
      room.transition()
        .duration(1)
        .attr("x", x<y?x:y)
      .attr("width", x<y?y-x:x-y)
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
        console.log("x",x,"y",y)
      })

    const slider = d3.select("#line")
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

    const room =  sliderSvg.append("rect")
      .attr("x", x)
      .attr("y", 0)
      .attr("height", 20)
      .attr("width", y-x)
      .style("fill", "#cddaef")
      .style("stroke", "#a3afc3")
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

  tooltip = (data) => {
    const tooltip = d3.select("#line")
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

    for (let i = 0; i < data.length; i += 1){
      const tip = ul.append("div")
        .attr("id", `${data[i].name}`)
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
        .style("background-color", data[i].color)
        .style("margin-right", "0px")
        .style("padding-right", "0px")
        .style("width", "8px")
        .style("height","8px")
        .attr("id", `${data[i].name}dot`)
      name.append("div")
        .style("display", "inline-block")
        .style("margin-left","5px")
        .attr("id", `${data[i].name}key`)
      tip.append("div")
        .style("display", "inline-block")
        .attr("id", `${data[i].name}val`)
        .style("margin-left", "30px")
        .style("float","right")
    }
    return tooltip
  }

  render() {
    return (
      <div id="line" style={{ display: "inline-block", position:"relative"}} >
      </div>
    );
  }
}

export default Line;
