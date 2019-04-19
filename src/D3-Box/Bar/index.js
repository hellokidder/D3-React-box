import React, { Component } from 'react';
import * as d3 from 'd3';

class Bar extends Component {

  componentDidMount() {
    const { data } = this.props

    const width = 500;

    var scaleX = d3.scaleLinear()
    .domain([0,d3.max(data)]).nice()
    .range([ 0,width])

  d3.select("#Bar")
    .selectAll("div")
      .data(data)
    .enter().append("div")
    .style("background", "#008ffa")
    .style("margin","2px")
    .style("width", function (d) {
      return scaleX(d) + "px";
    })
    .text(function(d) { return d; });
  }
  render() {
    return (
      <div id ="Bar">
      </div>
    );
  }
}

export default Bar;
