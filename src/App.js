import React, { Component } from 'react';
import * as d3 from 'd3';
import logo from './logo.svg';
import './App.css';
import { barData, lineData, pieData} from './D3-Box/config/config'
import PieChart from './D3-Box/PieChart'
import Tree from './D3-Box/Tree'
// import {testCsvData} from './D3-Box/utils/utils'
// import Line from './D3-Box/Line'
import LineChart from './D3-Box/LineChart'
import BarChart from './D3-Box/BarChart'
import Pack from './D3-Box/Pack'
class App extends Component {

  render() {
    // const csvt = testCsvData();
    // const csv = d3.csvParse(csvt)
   const a = {
     "name": "A",
    "children": [
     {
      "name": "B",
      "children": [
       {
        "name": "C",
        "children": [
         {"name": "D", "value": 3938},
         {"name": "E", "value": 3812},
         {"name": "F", "value": 6714},
         {"name": "G", "value": 743}
        ]
       },
       {
        "name": "H",
        "children": [
         {"name": "I", "value": 3534},
         {"name": "J", "value": 5731},
         {"name": "K", "value": 7840},
         {"name": "L", "value": 5914},
         {"name": "M", "value": 3416}
        ]
       },
       {
        "name": "N",
        "children": [
         {"name": "O", "value": 7074}
        ]
       }
      ]
     },
     {
      "name": "P",
      "children": [
        {
         "name": "S",
         "children": [
          {"name": "T", "value": 1983},
          {"name": "U", "value": 2047},
          {"name": "V", "value": 1375},
          {"name": "W", "value": 8746},
          {"name": "X", "value": 2202},
          {"name": "Y", "value": 1382},
          {"name": "Z", "value": 1629},
          {"name": "AA", "value": 1675},
          {"name": "AB", "value": 2042}
         ]
        },
       {"name": "Q", "value": 17010},
       {"name": "R", "value": 5842},
       {"name": "AC", "value": 1041},
       {"name": "AD", "value": 5176},
       {"name": "AE", "value": 449},
       {"name": "AF", "value": 5593},
       {"name": "AG", "value": 5534},
       {"name": "AH", "value": 9201},
       {"name": "AI", "value": 19975},
       {"name": "AJ", "value": 1116},
       {"name": "AK", "value": 6006}
      ]
     },
     {
      "name": "AL",
      "children": [
       {
        "name": "AM",
        "children": [
         {"name": "AN", "value": 721},
         {"name": "AO", "value": 4294},
         {"name": "AP", "value": 9800},
         {"name": "AQ", "value": 1314},
         {"name": "AR", "value": 2220}
        ]
       },
       {"name": "AS", "value": 1759},
       {"name": "AT", "value": 2165},
       {"name": "AU", "value": 586},
       {"name": "AV", "value": 3331},
       {"name": "AW", "value": 772},
       {"name": "AX", "value": 3322}
      ]
     }
    ]
   }
    // const b= {
    //   "name": "A1",
    //   "children": [
    //     {
    //       "name": "B1",
    //       "children": [
    //         {
    //           "name": "C1",
    //           "value": 100
    //         },
    //         {
    //           "name": "C2",
    //           "value": 300
    //         },
    //         {
    //           "name": "C3",
    //           "value": 200
    //         }
    //       ]
    //     },
    //     {
    //       "name": "B2",
    //       "value": 200
    //     }
    //   ]
    // }
    console.log(pieData)
    const layout = {
      width:800,
      height: 1000,
      // tooltip: true,
      // tooltipline: true,
      // slider:true,
      // legend:false,
      // curve: true,//将折线转化成条柔和的曲线
      // barwidth: 40,
      layout:"cluster",//"tree"
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        {/* <Line data={lineData} axis={axis} layout={layout} line={line} /> */}
        {/* <LineChart data={lineData} layout={layout} /> */}
        {/* <PieChart data={pieData} layout={layout}/> */}
        {/* <BarChart data={barData} layout={layout}/> */}
        <Tree data={a} layout={layout}/>
        <Pack data={a} layout={layout} />
      </div>
    );
  }
}

export default App;
