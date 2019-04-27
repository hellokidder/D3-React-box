import React, { Component } from 'react';
import * as d3 from 'd3';
import logo from './logo.svg';
import './App.css';
import { lineData, } from './D3-Box/config/config'
import {testCsvData} from './D3-Box/utils/utils'
import Line from './D3-Box/Line'
class App extends Component {
  render() {
    const csvt = testCsvData();
    const csv = d3.csvParse(csvt)
    const axis = {
      x: "T",
      y:["A", "B", "C"],
      axisX: {
        path: "#dddddd",
        pathwidth: 2,
        tick: "#dddddd",
        tickwidth: 1,
        text: "#585858"
      },
      axisY: {
        path: "white",
        pathwidth: 2,
        tick: "#dddddd",
        tickwidth: 1,
        text: "#585858"
      }
    }
    const layout = {
      width:1000,
      height: 500,
      padding: { top: 40, left: 45, right: 40, bottom: 40 },
      tooltip: true,
      tooltipline: true,
      slider:false,
      legend:true,
      dot: true,
    }
    const line = [
      {
        name: "A",
        dot: false,
        color: "#008ffa",
        width: 2,
        linecap: "square",
        linejoin: "miter",
        unit:"元"
      }, {
        name: "C",
        dot: false,
        // color: "#008ffa",
        width: 2,
        linecap: "square",
        linejoin: "round",
        unit:"元"
      }
    ]
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Line data={lineData} axis={axis} layout={layout} line={line} />
      </div>
    );
  }
}

export default App;
