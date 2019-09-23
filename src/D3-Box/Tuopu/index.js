import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

function TuopuChart({ data }) {

  useEffect(() => {

    var graph = {
      "nodes": [
        { "x": 469, "y": 410 },
        { "x": 493, "y": 364 },
        { "x": 442, "y": 365 },
        { "x": 467, "y": 314 },
        { "x": 477, "y": 248 },
        { "x": 425, "y": 207 },
        { "x": 402, "y": 155 },
        { "x": 369, "y": 196 },
        { "x": 350, "y": 148 },
        { "x": 539, "y": 222 },
        { "x": 594, "y": 235 },
        { "x": 582, "y": 185 },
        { "x": 633, "y": 200 }
      ],
      "links": [
        { "source": 0, "target": 1 },
        { "source": 1, "target": 2 },
        { "source": 2, "target": 0 },
        { "source": 1, "target": 3 },
        { "source": 3, "target": 2 },
        { "source": 3, "target": 4 },
        { "source": 4, "target": 5 },
        { "source": 5, "target": 6 },
        { "source": 5, "target": 7 },
        { "source": 6, "target": 7 },
        { "source": 6, "target": 8 },
        { "source": 7, "target": 8 },
        { "source": 9, "target": 4 },
        { "source": 9, "target": 11 },
        { "source": 9, "target": 10 },
        { "source": 10, "target": 11 },
        { "source": 11, "target": 12 },
        { "source": 12, "target": 10 }
      ]
    }
    // console.log(graph);
    var width = 960,
      height = 500;

    var force = d3.forceSimulation()
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", tick);

    var svg = d3.select("#tuopusvg")
      .attr("width", width)
      .attr("height", height);

    var link = svg.selectAll(".link"),
      node = svg.selectAll(".node");



    force
      .nodes(graph.nodes)
      .force("link", d3.forceLink(graph.links));


    link = link.data(graph.links)
      .enter().append("line")
      .style("stroke", "#a3afc3")
      .attr("class", "link");

    node = node.data(graph.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 12)
      // .on("dblclick", dblclick)
      .call(d3.drag()
        .on("start", dragstart)
        .on("drag", dragged));
    //.on("end",dragended));


    function tick() {
      link.attr("x1", function (d) { return d.source.x; })
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
    <div  style={{ height: '100%' }}>
      {/* <div id={`line-tooltip${data.name}`} /> */}
      <svg id={`tuopusvg`} width="100%" height="100%" />
    </div>
  );
}

export default TuopuChart;
