import React, { Component } from 'react';
import {data2linedata,findMinMax } from '../utils/utils'
import * as d3 from 'd3';

class LineChart extends Component {
  state = {
    data: [],
    lineData: [],
    width:1000,
    height: 500,
    padding: { top: 40, left: 45, right: 40, bottom: 40 },
    color: ["#008ffa", "#00c061", "#EE2764", "#ffcb3c", "#223670"],
    dotable: false,
    tooltipable: true,
    tooltiplineable: true,
    legendable: false,
    sliderable: false,
    lineConfig : {
      width: 2,
      linecap: "round",
      linejoin:"round",
      unit:"yuan"
      },
    axis: {
      axisX: {
        path: "#dddddd",
        pathwidth: 2,
        tick: "#dddddd",
        tickwidth: 1,
        text: "#585858"
      },
      axisY: {
        path: "white",
        pathwidth: 2,
        tick: "#dddddd",
        tickwidth: 1,
        text: "#585858"
      }
    }
  };

  componentWillMount() {
    const { data, axis, layout, line } = this.props;
    const { axis: axisConfig, color, lineConfig, padding, dotable} = this.state
    // 向axis中添加x,y轴数据,默认以第一个数据项为X轴
    const keys = Object.keys(data[0])
    axisConfig.X = axis?( axis.x ? axis.x : keys[0]) : keys[0]
    keys.splice(keys.indexOf(axisConfig.X),1)
    axisConfig.Y = axis ? (axis.y ? axis.y : keys) : keys
    //************************************************* */
    // 初始化轴数据
    function setaxis(xOrY) {
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
    //****************************************************** */
    // 初始化各项配置
    if (layout !== undefined) {
      if (layout.width) {
        this.setState({
          width:layout.width
        })
      }
      if(layout.height) {
        this.setState({
          height:layout.height
        })
      }
      if (layout.dot !== undefined) {
        this.setState({
          dotable:layout.dot
        })
      }
      if(layout.slider !== undefined) {
        this.setState({
          sliderable:layout.slider
        })
      }
      if(layout.legend !== undefined) {
        this.setState({
          legendable: layout.legend
        })
      }
      if(layout.tooltip !== undefined) {
        this.setState({
          tooltipable:layout.tooltip
        })
      }
      if (layout.tooltipline !== undefined) {
        this.setState({
          tooltiplineable:layout.tooltipline
        })
      }
    }


    if(layout.slider) padding.bottom += 30
    if(layout.legend) padding.bottom += 20


    //*********************************************************** */
    // 初始化线数据
    const lineData = data2linedata(data, axisConfig.Y)
    function setlineData() {
      const { width, linecap, linejoin, unit } = lineConfig
      for (let i = 0; i < lineData.length; i += 1){
        lineData[i].dot = layout.dotable? layout.dotable : dotable
        lineData[i].width = width
        lineData[i].click = false
        lineData[i].linecap = linecap
        lineData[i].linejoin = linejoin
        lineData[i].unit = unit
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
              if (line[n].dot !== undefined) lineData[i].dot = line[n].dot
              if (line[n].linejoin) lineData[i].linejoin = line[n].linejoin
            }
          }
        }
      }
    }
    setlineData()
    //********************************************************************** */
    this.setState({
      axis: axisConfig,
      padding,
      lineData,
      data,
    })
  }


  componentDidMount() {
    const { data, padding, height, width,axis,lineData, tooltiplineable,sliderable } = this.state;
    const pathwidth = width - padding.left - padding.right
    const pathheight = height - padding.top - padding.bottom
    const svg = d3.select("#svg")
    const minMaxY = findMinMax(data, axis)
    // 放大器
    const scaleX = d3.scaleLinear()
      .domain([0,data.length-1])
      .range([0, pathwidth])
    const scaleY = d3.scaleLinear()
      .domain([minMaxY.min,minMaxY.max]).nice()
      .range([pathheight, 0])
    // 轴线生成×××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
    // 线条生成器
    const x = d3.axisBottom(scaleX)
    const y = d3.axisLeft(scaleY)
    // y轴
    const axisY = svg.append("g")
    .attr("transform", `translate(${padding.left},${padding.top})`)
    .call(y)
    // X轴
    const axisX = svg.append("g")
    .attr("id","axisX")
    .attr("transform", `translate(${padding.left},${pathheight + padding.top})`)
    .call(x)
    // 修改X轴显示的数据
    axisX.selectAll("g")
    .selectAll("text")
    .text(function (d) {
      if (d < data.length) {
        return data[d][axis.X]
      }
    })
    this.axisColor(axisX, axis.axisX)
    this.axisColor(axisY, axis.axisY)

  // 折线生成×××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
    const lineGengeator = d3.line()
      .x(function (d,i) {
        return scaleX(i)
      })
      .y(function (d) {
        return scaleY(d)
      })
    for (let i = 0; i < lineData.length; i += 1){
      this.drawLine(lineData[i], svg, lineGengeator, padding)
      if (lineData[i].dot) {
        this.drowLineCircle(lineData[i],svg,scaleX,scaleY,padding)
      }
    }

    //tooltipline**********************************************************************
    let tooltipLine = {}
    if (tooltiplineable) {
      tooltipLine = this.tooltipLine(pathheight)
    }
    if (sliderable) {
      this.setSlider(padding,pathwidth,height,this,axisX,axis.X)
    }
  }



  setSlider = (padding, pathwidth, height, linechart,axisX,X) => {
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

      const {data} = linechart.state
      const　unScaleX = d3.scaleLinear()
      .domain([0,pathwidth])
      .range([0, data.length - 1])
      const roomX = Math.ceil(unScaleX(x - padding.left))
      const roomY = Math.floor(unScaleX(y - padding.left))
      const newData = data.slice(roomX, roomY + 1)
      console.log(data,roomX,roomY,"NEW",newData,X)
      const scaleX = d3.scaleLinear()
      .domain([0,newData.length-1])
        .range([0, pathwidth])

    // 修改X轴显示的数据
    axisX.selectAll("g")
    .selectAll("text")
    .text(function (d) {
      if (d < newData.length) {
        return newData[d][X]
      }
    })
    const axisx = d3.axisBottom(scaleX)
    axisX.transition()
    .duration(1000)
    .call(axisx)













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

  tooltipLine = (pathheight) => {
    const tooltipLine = d3.select("#svg")
    .append("path")
    .style("fill", "none")
    .style("stroke", "#dddddd")
    .style("stroke-width", "1")
    .attr("d", `M0,0L0,${pathheight}`)
    .style("opacity",0)
    return tooltipLine
  }

  drowLineCircle = (linedata, svg, scaleX, scaleY, padding ) =>{
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

  drawLine = (linedata, svg, lineGengeator, padding) => {
    svg.append("path")
      .attr("id", linedata.name)
      .style("fill", "none")
      .style("stroke", linedata.color)
      .style("stroke-dasharray", 1000000)
      .style("stroke-width", linedata.width)
      .style("stroke-linecap",linedata.linecap)
      .style("stroke-linejoin",linedata.linejoin)
      .attr("d",  lineGengeator(linedata.data))
      .attr("transform", `translate(${padding.left},${padding.top})`)
      .attr("stroke-dashoffset", 1000000)
      .transition()
      .duration(10000)
      .attr("stroke-dashoffset", 0)
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

  render() {
    const { width, height, padding } = this.state
    console.log(padding)
    // const linepath = {}
    // const tooltip = {}
    // const tooltipLine = {}
    // const slider = {}
    // const legend ={}
    return (
      <div id="linechart" style={{ display: "inline-block", position: "relative" }} >
        <svg id="svg" width={width} height={height} />
      </div>
    );
  }
}

export default LineChart;
