import React, { Component } from 'react';
import * as d3 from 'd3';

class Pack extends Component {

  componentDidMount() {
    const width = 800
    const height = 800
    const padding = { top: 40,left:40, right:40,bottom:40}
    const data = {
      "name": "A1",
      "children": [
        {
          "name": "B1",
          "children": [
            {
              "name": "C1",
              "value": 100
            },
            {
              "name": "C2",
              "value": 300
            },
            {
              "name": "C3",
              "value": 200
            }
          ]
        },
        {
          "name": "B2",
          "value": 200
        }
      ]
    }
    const svg = d3.select("#Pack")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

svg.append("g")
    .attr("transform","translate("+padding.top+","+padding.left+")");


    const root = d3.hierarchy(data)
    .sum(function(d){
      return d.value;
    });


    var treeLayout = d3.pack();
    treeLayout.size([300, 300])
    .padding(10)

    treeLayout(root);

    var nodes = d3.select('svg g')
  .selectAll('g')
  .data(root.descendants())
  .enter()
  .append('g')
      .attr('transform', function (d) { return 'translate(' + [d.x, d.y] + ')' })
      .style('fill', "none")
      .style("stroke", "blue")

nodes
  .append('circle')
  .attr('r', function(d) { return d.r; })

nodes
  .append('text')
  .attr('dy', 4)
  .text(function(d) {
    return d.children === undefined ? d.data.name : '';
  })
  }
  render() {
    return (
      <div id="Pack">
      </div>
    );
  }
}

export default Pack;
