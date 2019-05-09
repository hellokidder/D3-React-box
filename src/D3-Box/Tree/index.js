import React, { Component } from 'react';
import * as d3 from 'd3';

class Tree extends Component {

  componentDidMount() {
    const { data } = this.props
    console.log(data)
    const marge = { top: 50, bottom: 0, left: 10, right: 0 };
    const width = 800
    const height = 800

    const svg = d3.select("#Tree")
      .append("svg")
      .attr("width", width)
    .attr("height",height)

    const g = svg.append("g")
    		.attr("transform","translate("+marge.top+","+marge.left+")");

    //创建一个hierarchy layout
    var hierarchyData = d3.hierarchy(data)
    .sum(function(d){
      return d.value;
    });

    console.log(hierarchyData)

  //创建一个树状图
  var tree = d3.tree()
    .size([height,width-200])
    .separation(function(a,b){
      return (a.parent===b.parent?1:2)/a.depth;
    })

  //初始化树状图，也就是传入数据,并得到绘制树基本数据
  var treeData = tree(hierarchyData);
  // console.log(treeData);
  //得到节点
  var nodes = treeData.descendants();
  var links = treeData.links();

  //输出节点和边
  console.log(nodes);
  console.log(links);

  //创建一个贝塞尔生成曲线生成器
  var Bézier_curve_generator = d3.linkHorizontal()
    .x(function(d) { return d.y; })
    .y(function(d) { return d.x; });

  //有了节点和边集的数据后，我们就可以开始绘制了，
  //绘制边
  g.append("g")
    .selectAll("path")
    .data(links)
    .enter()
    .append("path")
    .attr("d",function(d){
      var start = {x:d.source.x,y:d.source.y};
      var end = {x:d.target.x,y:d.target.y};
      return Bézier_curve_generator({source:start,target:end});
    })
    .attr("fill","none")
    .attr("stroke","#585858")
    .attr("stroke-width",1);

  //绘制节点和文字
  //老规矩，先创建用以绘制每个节点和对应文字的分组<g>
  var gs = g.append("g")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      // console.log(d)
      var cx = d.x;
      var cy= d.y;
      return "translate("+cy+","+cx+")";
    });
  //绘制节点
  gs.append("circle")
    .attr("r",6)
    .attr("fill","white")
    .attr("stroke","blue")
    .attr("stroke-width",1);

  //文字
  gs.append("text")
    .attr("x", function (d) {
      return d.children?-40:8;
    })
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
