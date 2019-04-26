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
    // console.log(csv)
    const axis = {
      // x: "X",
      // y:["A"],
      // axisX: {
      //   path: "red",
      //   tick:"black"
      // }
    }
    const layout = {
      width: 1000
    }
    const line = [
      {
        name: "A",
        dot: false,
        color: "#008ffa",
        width: 2,
        linecap: "square",
        linejoin: "miter",
        // dasharray: "10",
        unit:"元"
      }
    ]
    console.log(lineData)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Line data={csv} tooltip={true} tooltipline={true} axis={axis} dot={false} layout={layout} line={line} />
      </div>
    );
  }
}

export default App;
