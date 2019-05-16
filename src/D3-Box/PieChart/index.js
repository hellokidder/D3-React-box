import React, { Component } from 'react';
import * as d3 from 'd3';

class PieChart extends Component {
  componentDidMount() {
    const { data, layout } = this.props;
    const padding = { top: 40, left: 45, right: 40, bottom: 40 };
    const color = ["#1890FF", "#2FC25B", "#FACC14", "#223273", "#8543E0","#13C2C2","#3436C7","#F04864"]
    const width = layout.width?layout.width:1000;
    const height = layout.height ? layout.height : 500;
    const legend = layout.legend ? layout.legend : false

    for (let i = 0; i < data.length; i += 1) {
      data[i].color = color[i]
      data[i].click = false
    }
    data.sort(function (a,b) {
      return(b.data-a.data)
    })
    this.drawPie(data,padding,width,height,legend)
  }
  drawPie = (data,padding,width,height,legend) => {

    const svg = d3.select("#piesvg")
    .attr("width", width)
    .attr("height",height)
    const g = svg.append('g')
      .attr('transform', `translate(${legend?width*3/8:width/2} ,${ height/2})`)


    const minWandH = width<height?width:height
    const outerRadius = (minWandH-padding.top-padding.bottom)/2
    const innerRadius = outerRadius/2
    const arc_generator = d3.arc()
      .padAngle(.1)
      .padRadius(20)
      .cornerRadius(4)
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)

    const over_generator= d3.arc()
    .padAngle(.1)
    .padRadius(20)
    .cornerRadius(4)
    .innerRadius(innerRadius+20)
    .outerRadius(outerRadius+20)

    const drawData = []
    for (let i = 0; i < data.length; i += 1){
      if (!data[i].click) {
        drawData.push(data[i])
      }
    }
    const arcData = d3.pie()
      .sort(function (a,b) {
        return b.data-a.data
      })
      .value(function (d) {
        let sum = 0
        for (let i = 0; i < drawData.length; i += 1){
          sum = sum + drawData[i].data
        }
        return Math.round(d.data/sum*100)
      })(drawData)

    const gs = g.selectAll('.g')
      .data(arcData)
      .enter()
      .append('g')
    const arc = gs.append('path')
      .attr('fill', function (d, i) {
        return d.data.color
      })
      .attr("id", function (d) {
        return `pie${d.data.data}${d.data.name}`
      })
      // .attr("d", function (d) {
      //   return arc_generator(d)
      // })
      .on("mouseover", function (d,i) {
      d3.select(this)
        .transition()
        .duration(500)
        .attr('d', function(d) {
          return over_generator(d)
        })
      d3.select(`#${d.data.name}${d.data.data}`)
        .transition()
        .duration(500)
        .attr('transform', function(d) {
          //位置设在中心处
          return `translate(${over_generator.centroid(d)})`
        })
      centerG.select(`#title`)
        .transition()
        .duration(500)
        .text(function () {
          return d.data.name
        })
      centerG.select(`#value`)
        .transition()
        .duration(500)
        .text(function () {
          return d.data.data
        })
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .transition()
        .duration(500)
        .attr('d', function(d) {
          return arc_generator(d)
        })
      d3.select(`#${d.data.name}${d.data.data}`)
        .transition()
        .duration(500)
        .attr('transform', function(d) {
          //位置设在中心处
          return `translate(${arc_generator.centroid(d)})`
        })
      centerG.select(`#title`)
        .transition()
        .duration(500)
        .text(function () {
          return "总额"
        })
      centerG.select(`#value`)
        .transition()
        .duration(500)
        .text(function () {
          let sum = 0
          for (let i = 0; i < data.length; i += 1){
            sum = sum + data[i].data
          }
          return sum
        })
    })

    arc.transition().duration(500).attrTween('d',function(d){
      var compute = d3.interpolate(d.startAngle, d.endAngle);
      return function(t){
            d.endAngle = compute(t);
            return arc_generator(d);
        }
    })

    gs.append('text')
      .attr("id", function (d) {
        return `${d.data.name}${d.data.data}`
      })
      .style("cursor", "default")
    .attr('transform', function(d) {
        //位置设在中心处
        return `translate(${arc_generator.centroid(d)})`
    })
    .attr("fill","white")
    .attr('text-anchor', 'middle')
      .text(function (d) {
        let value =""
        // if (d.endAngle - d.startAngle > 0.15) {
        // }
        value = `${d.value}%`
        return value
    })
    .on("mouseover", function (d,i) {
    d3.select(`#pie${d.data.data}${d.data.name}`)
      .transition()
      .duration(500)
      .attr('d', function(d) {
        return over_generator(d)
      })
    d3.select(`#${d.data.name}${d.data.data}`)
      .transition()
      .duration(500)
      .attr('transform', function(d) {
        //位置设在中心处
        return `translate(${over_generator.centroid(d)})`
      })
    centerG.select(`#title`)
      .transition()
      .duration(500)
      .text(function () {
        return d.data.name
      })
    centerG.select(`#value`)
      .transition()
      .duration(500)
      .text(function () {
        return d.data.data
      })
  })
    const centerG = g.append('g')

    centerG.append('text')
    .attr("id","title")
  .attr("fill","#8b8b8b")
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(0,-35)`)
  .text(function(d) {
      return "总额"
  })
    centerG.append('text')
    .attr("id","value")
    .attr("fill", "#000000")
    .attr("font-size",40)
    .attr('text-anchor', 'middle')
      .attr('transform', `translate(0,20)`)
      .text(function (d) {
      let sum = 0
      for (let i = 0; i < data.length; i += 1){
        sum = sum + data[i].data
      }
      return sum
    })
    if (legend) {
      this.setLegend(svg, centerG, gs, this, height, width, padding, data)
    }
  }
  setLegend = (svg,centerG,gs, pieChart,height, width, padding, data) => {
    // const { height, width, data } = this.state;
    const legend = svg.append('g')
    .attr('transform', `translate(  ${width * 3 / 4} ,${height / 2})`)
    for (let i = 0; i < data.length; i += 1){
      const color = data[i].click?"#bfbfbf":data[i].color
      legend.append("circle")
        .attr("r", 6)
        .attr("cy", function(d) {
          return i*30
        })
        .attr("fill", color)
      legend.append("text")
        .attr("fill", "#9e9e9e")
        .style("cursor", "pointer")
      .attr('transform', `translate( 10,${ (i*30)+6})`)
        .text(function () {
        return `${data[i].name}`
        })
        .on("mouseover", function () {
          if (!data[i].click) {
            d3.select(`#pie${data[i].data}${data[i].name}`)
            .transition()
              .duration(500)
              .style("opacity",0.5)
            centerG.select(`#title`)
            .transition()
            .duration(500)
            .text(function () {
              return data[i].name
            })
            centerG.select(`#value`)
            .transition()
            .duration(500)
            .text(function () {
              return data[i].data
            })
          }
        })
        .on("mouseout", function () {
          d3.select(`#pie${data[i].data}${data[i].name}`)
          .transition()
          .duration(500)
          .style("opacity",1)

          centerG.select(`#title`)
          .transition()
          .duration(500)
          .text(function () {
            return "总额"
          })
          centerG.select(`#value`)
          .transition()
          .duration(500)
          .text(function () {
            let sum = 0
            for (let i = 0; i < data.length; i += 1){
              if(!data[i].click)
              sum = sum + data[i].data
            }
            return sum
          })
        })
        .on("click", function () {
          data[i].click = !data[i].click
          gs.remove()
          legend.remove()
          centerG.remove()
          pieChart.drawPie(data,padding,width,height,legend)
        })
    }
  }

  render() {
    return (
      <div id="Pie" style={{ display: "inline-block", position: "relative" }}>
        <svg id="piesvg" />
      </div>
    );
  }
}

export default PieChart;
