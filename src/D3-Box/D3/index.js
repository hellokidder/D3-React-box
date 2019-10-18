import React, { Component } from 'react';
import * as d3 from 'd3';

class D3text extends Component {

  componentDidMount() {
    const { data, layout } = this.props
    const padding = { top: 40, bottom: 40, left: 40, right: 40 };

    // d3.select("#D3text").append("p").text("d3......");
    d3.select("[abb=abb]").append("p").text("d3.....zzz.");


  }
  render() {
    return (
      <div id="D3text" abb="abb">
      </div>
    );
  }
}

export default D3text;
