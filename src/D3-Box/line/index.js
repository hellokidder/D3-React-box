import React, { Component } from 'react';
import * as d3 from 'd3';


class Line extends Component {

  componentDidMount() {
    // const { data } = this.props
    // console.log("data",data)
    const width = 1000
    const height = 500
    const padding = { top: 40, left: 40, right: 40, bottom: 40 }
    const pathwidth = width - padding.left - padding.right
    const pathheight = height - padding.top - padding.bottom
    const color = ["#008ffa", "#00c061", "#ffcb3c"]

    d3.dsv(",", "test.csv", function(d) {
      console.log(d)
    }).then(function(data) {
      console.log(data);
    });

    const ff ="A,B,C,PT\n135141,-73313,123116,123264\n140661,-86497,145436,123264\n133301,-79905,145436,123456\n131461,-86497,123116,123360\n131461,-79905,130556,123360\n140661,-79905,145436,123072\n125941,-79905,130556,123360\n138821,-53537,123116,123456\n138821,-79905,130556,123456\n138821,-60129,130556,123264\n138821,-73313,130556,123360\n138821,-60129,145436,123360\n131461,-79905,123116,123360\n135141,-60129,123116,123360\n133301,-79905,123116,123264\n135141,-60129,152876,123456\n138821,-79905,123116,123360\n133301,-79905,130556,123360\n129621,-73313,115676,123360\n133301,-86497,152876,123456\n131461,-60129,145436,123360\n131461,-73313,130556,123264\n129621,-79905,123116,123264\n131461,-86497,123116,123360\n133301,-86497,115676,123360\n138821,-79905,130556,123264\n133301,-53537,130556,123072\n135141,-79905,145436,123264\n133301,-60129,145436,123360\n133301,-73313,130556,123360\n133301,-79905,145436,123264"

    const csv = d3.csvParse(ff)
    // console.log(csv)

    const lineType = ["A", "B", "C", "PT"]
    function csv2linedata(csv,lineType,X) {
      const lineData = []
      for (let i = 0; i < lineType.length; i += 1){
        lineData[i] = {}
        lineData[i].name = lineType[i]
        lineData[i].data = []
        if(X === undefined){
          for (let n = 0; n < csv.length; n += 1)
              lineData[i].data.push([n, csv[n][lineType[i]]])
        }
      }
      return lineData
    }
    const data = csv2linedata(csv,lineType)
    // console.log("data", data)

    function findMinMax(csv, lineType) {
      const MinMax = [0,0]
      console.log(csv)
      for (let i = 0; i < csv.length; i += 1){
        for (let n = 0; n < lineType.length; n += 1){
          console.log(typeof(csv[i][lineType[n]]-0))
          if(csv[i][lineType[n]]-0 < MinMax[0]) MinMax[0] = csv[i][lineType[n]]
          if(csv[i][lineType[n]]-0 > MinMax[1]) MinMax[1] = csv[i][lineType[n]]
        }
      }
      console.log(MinMax)
      return MinMax
    }
    const yMinMax = findMinMax(csv, lineType)
    // 放大器
    var scaleX = d3.scaleLinear()
      .domain([0,csv.length-1]).nice()
      .range([0, pathwidth])
    var scaleY = d3.scaleLinear()
      .domain([yMinMax[0],yMinMax[1]]).nice()
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
