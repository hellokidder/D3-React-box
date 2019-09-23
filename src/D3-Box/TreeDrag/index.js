import React, { Component } from 'react';
import * as d3 from 'd3';

class TreeDrag extends Component {

  componentDidMount() {
    const { data, layout } = this.props
    const padding = { top: 40, bottom: 40, left: 40, right: 40 };
    const width = layout.width
    const height = layout.height

    const svg = d3.select("#dragTree")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    const g = svg.append("g")
      .attr("transform", `translate(${padding.top},${padding.left})`);

    //创建一个hierarchy layout
    var hierarchyData = d3.hierarchy(data)
      .sum(function (d) {
        return d.value;
      });


    // console.log(">>>>>>>>>>>>>>>>>>>",hierarchyData);
    // console.log("<<<<<<<<<<<<<<<");

    //创建一个树状图
    let tree = {}
    if (layout.layout === "tree") {
      tree = d3.tree()
    } else if (layout.layout === "cluster") {
      tree = d3.cluster()
    }
    tree.size([height - padding.top - padding.bottom, width - padding.left - padding.right - 200])
      .separation(function (a, b) {
        return (a.parent === b.parent ? 1 : 3) / a.depth;
      })

    //也就是传入数据,并得到绘制树基本数据
    var treeData = tree(hierarchyData);
    // console.log(treeData);
    //得到节点
    var nodes = treeData.descendants();
    var links = treeData.links();

    console.log("links", links);
    //创建一个贝塞尔生成曲线生成器
    var Bezier_curve_generator = d3.linkHorizontal()
      .x(function (d) { return d.y; })
      .y(function (d) { return d.x; });

      function linksChange(name,m){
        for(let i = 0;i<links.length;i++ ){
          if(links[i].source.data.name ===name){
            links[i].source.x=m[1]
            links[i].source.y=m[0]
          }
          if(links[i].target.data.name ===name){
            links[i].target.x=m[1]
            links[i].target.y=m[0]
          }
        }
      }



    g.append('defs')
      .append('clipPath') // 添加长方形方块，遮罩作用
      .attr('id', 'clip')
      .append('rect')
      .attr('height', height)
      .attr('width', 0) // 用遮罩实现线动画
      .transition()
      .duration(1000)
      .attr('width', width)
    //绘制边

    const gLinks = g.append("g")
      .attr("class", "g_links")
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr('clip-path', 'url(#clip)')
      .attr("id", function (d) {
        return `${d.source.data.name}-${d.target.data.name}`
      })
      .attr("d", function (d) {
        var start = { x: d.source.x, y: d.source.y };
        var end = { x: d.target.x, y: d.target.y };
        return Bezier_curve_generator({ source: start, target: end });
      })
      .attr("fill", "none")
      .attr("stroke", "#d0d0d0")
      .attr("stroke-width", 1);

    //绘制节点和文字
    // var gs = g.append("g")
    //   .selectAll("g")
    //   .data(nodes)
    //   .enter()
    //   .append("g")
    // .attr("transform", function (d) {
    //   var cx = d.x;
    //   var cy= d.y;
    //   return `translate(${cy},${cx})`;
    // })
    // .call(d3.drag()
    //   .on("start", dragstart)
    //   .on("drag", dragged));

    //绘制节点
    g.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return d.y
      })
      .attr("cy", function (d) {
        return d.x
      })
      .attr("r", 6)
      .attr("fill", "white")
      .attr("stroke", function (d) {
        return d.children ? "#F04864" : "#1890FF"
      })
      .attr("stroke-width", 1)
      .call(d3.drag()
        .on("drag", dragged));


    function dragged(d) {
      const m = d3.mouse(this)
      const nodeName = d.data.name;
      d3.select(this)
        .transition()
        .duration(1)
        .attr("cx", function (d) {
          return m[0]
        })
        .attr("cy", function (d) {
          return m[1]
        })

      d3.select(".g_links").selectAll("path")
        .filter(function (d, i) {
          return d.target.data.name === nodeName
        })
        .attr("d", function (d) {
          var start = { x: d.source.x, y: d.source.y };
          var end = { x: m[1], y: m[0] };
          return Bezier_curve_generator({ source: start, target: end });
        })

      d3.select(".g_links").selectAll("path")
        .filter(function (d, i) {
          return d.source.data.name === nodeName
        })
        .attr("d", function (d) {
          // var start = { x: d.source.x, y: d.source.y };
          var start = { x: m[1], y: m[0] };
          var end = { x: d.target.x, y: d.target.y };

          return Bezier_curve_generator({ source: start, target: end });
        })
        linksChange(nodeName,m)
    }



  }
  render() {
    return (
      <div id="dragTree">
      </div>
    );
  }
}

export default TreeDrag;
