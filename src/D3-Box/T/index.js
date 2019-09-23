import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

function Tat({ data }) {

  useEffect(() => {

    var width = 960,
      height = 500;

    const padding = { top: 40, bottom: 40, left: 40, right: 40 };



    var hierarchyData = d3.hierarchy(data)
      .sum(function (d) {
        return d.value;
      });



    let tree = d3.tree().size([width - padding.left - padding.right, height - padding.top - padding.bottom])
      .separation(function (a, b) {
        return (a.parent === b.parent ? 1 : 3) / a.depth;
      })

    var treeData = tree(hierarchyData);
    //得到节点
    var nodes = treeData.descendants();
    var links = treeData.links();


    var force = d3.forceSimulation()
      // .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height*3 / 4))
      .on("tick", tick);

    var svg = d3.select("#tatsvg")
    // .attr("transform", `translate(${0},${100})`)
      .attr("width", width)
      .attr("height", height);

    var link = svg.selectAll(".link"),
      node = svg.selectAll(".node");



    force
      .nodes(nodes)
      // .force("link", d3.forceLink(links));


    link = link.data(links)
      .enter().append("line")
      .style("stroke", "#a3afc3")
      .attr("class", "link");

    node = node.data(nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 12)
      .call(d3.drag()
        .on("start", dragstart)
        .on("drag", dragged));
    //.on("end",dragended));


    function tick() {
      link.attr("x1", function (d) {
        return d.source.x;
      })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });

      node.attr("cx", function (d) { d.fx = d.x; return d.x; })
        .attr("cy", function (d) { d.fy = d.y; return d.y; });
    }

    // function dblclick(d) {
    //   d3.select(this).classed("fixed", d.fixed = false);
    //   console.log("dblclick"+d.fixed);
    // }

    function dragstart(d) {
      if (!d3.event.active) {
        force.alphaTarget(.1).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function dragended(d) {
      // force.stop();
      if (!d3.event.active) {
        force.alphaTarget(0);
      }
      // d.fx = null;
      // d.fy = null;
    }

    return () => { };
  }, []);

  return (
    <div style={{ height: '100%' }}>
      {/* <div id={`line-tooltip${data.name}`} /> */}
      <svg id={`tatsvg`} width="100%" height="100%" />
    </div>
  );
}

export default Tat;
