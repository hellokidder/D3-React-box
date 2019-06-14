import React, { Component } from 'react';
import * as d3 from 'd3';

class Tree extends Component {

  componentDidMount() {
    const { data, layout } = this.props
    const padding = { top: 40, bottom: 40, left: 40, right: 40 };
    const width = layout.width
    const height = layout.height

    const svg = d3.select("#Tree")
      .append("svg")
      .attr("width", width)
      .attr("height",height)

    const g = svg.append("g")
    		.attr("transform",`translate(${padding.top},${padding.left})`);

    //创建一个hierarchy layout
    var hierarchyData = d3.hierarchy(data)
    .sum(function(d){
      return d.value;
    });

  //创建一个树状图
    let tree = {}
    if (layout.layout === "tree") {
      tree = d3.tree()
    } else if(layout.layout === "cluster") {
      tree = d3.cluster()
    }
    tree.size([height-padding.top-padding.bottom,width-padding.left-padding.right-200])
    .separation(function(a,b){
      return (a.parent===b.parent?1:3)/a.depth;
    })

  //也就是传入数据,并得到绘制树基本数据
  var treeData = tree(hierarchyData);
  // console.log(treeData);
  //得到节点
  var nodes = treeData.descendants();
  var links = treeData.links();


  //创建一个贝塞尔生成曲线生成器
  var Bezier_curve_generator = d3.linkHorizontal()
    .x(function(d) { return d.y; })
    .y(function(d) { return d.x; });

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
  g.append("g")
    .selectAll("path")
    .data(links)
    .enter()
    .append("path")
    .attr('clip-path', 'url(#clip)')
    .attr("d",function(d){
      var start = {x:d.source.x,y:d.source.y};
      var end = {x:d.target.x,y:d.target.y};
      return Bezier_curve_generator({source:start,target:end});
    })
    .attr("fill","none")
    .attr("stroke","#d0d0d0")
    .attr("stroke-width",1);

  //绘制节点和文字
  var gs = g.append("g")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      var cx = d.x;
      var cy= d.y;
      return `translate(${cy},${cx})`;
    });
  //绘制节点
  gs.append("circle")
    .attr("r",6)
    .attr("fill","white")
    .attr("stroke", function (d) {
      return d.children? "#F04864":"#1890FF"
    })
    .attr("stroke-width",1);

  //文字
  gs.append("text")
    .attr("x", function (d) {
      return d.children?-8:8;
    })
    .attr('text-anchor', function (d) {
      return d.children?"end":"start"
    })
    .attr("fill","#a2a2a2")
    .attr("y",-5)
    .attr("dy",10)
    .text(function(d){
      return d.data.name;
    });


  }
  render() {
    return (
      <div id = "Tree">
      </div>
    );
  }
}

export default Tree;
