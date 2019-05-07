import React, { Component } from 'react';
import * as d3 from 'd3';
import logo from './logo.svg';
import './App.css';
import { barData, lineData} from './D3-Box/config/config'
import Pie from './D3-Box/Pie'
// import {testCsvData} from './D3-Box/utils/utils'
// import Line from './D3-Box/Line'
import LineChart from './D3-Box/LineChart'
// import BarChart from './D3-Box/BarChart'
class App extends Component {

  render() {
    // const csvt = testCsvData();
    // const csv = d3.csvParse(csvt)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        {/* <Pie /> */}
        {/* <Line data={lineData} axis={axis} layout={layout} line={line} /> */}
        <LineChart data={lineData}/>
        {/* <BarChart data={barData} tooltipable={true}/> */}
      </div>
    );
  }
}

export default App;
