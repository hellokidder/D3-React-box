import React, { Component } from 'react';
import * as d3 from 'd3';
import logo from './logo.svg';
import './App.css';
import { barData, lineData, pieData} from './D3-Box/config/config'
// import PieChart from './D3-Box/PieChart'
import Tree from './D3-Box/Tree'
import Treemap from './D3-Box/Treemap'
import Partition from './D3-Box/Partition'
import PartitionSun from './D3-Box/PartitionSun'
// import {testCsvData} from './D3-Box/utils/utils'
// import Line from './D3-Box/Line'
import LineChart from './D3-Box/LineChart'
import BarChart from './D3-Box/BarChart'
import Pack from './D3-Box/Pack'
import Chord from './D3-Box/Chord'
import Force from './D3-Box/Force'
import Heatmap from './D3-Box/Git-heatmap'
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
         {"name": "G", "value": 7043}
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
         {"name": "O", "value": 10074}
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
       {"name": "Q", "value": 1010},
       {"name": "R", "value": 5842},
       {"name": "AC", "value": 1041},
       {"name": "AD", "value": 5176},
       {"name": "AE", "value": 4049},
       {"name": "AF", "value": 5593},
       {"name": "AG", "value": 5534},
       {"name": "AH", "value": 9201},
       {"name": "AI", "value": 1975},
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
         {"name": "AN", "value": 3721},
         {"name": "AO", "value": 4294},
         {"name": "AP", "value": 9800},
         {"name": "AQ", "value": 1314},
         {"name": "AR", "value": 2220}
        ]
       },
       {"name": "AS", "value": 1759},
       {"name": "AT", "value": 2165},
       {"name": "AU", "value": 5686},
       {"name": "AV", "value": 3331},
       {"name": "AW", "value": 7172},
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
    const chordata = {
      names: ['北京', '上海', '广州', '深圳'],
      matrix: [
        [11975, 5871, 8916, 2868],
        [1951, 10048, 2060, 6171],
        [8010, 16145, 8090, 8045],
        [1013, 990, 940, 6907]
      ]
    }
    const forcedata = {
      nodes: [
        { name: 'A人物' },
        { name: 'B人物' },
        { name: 'C人物' },
        { name: 'D人物' },
        { name: 'E人物' },
        { name: 'F人物' },
        { name: 'G人物' },
      ],
      edges: [
        // value越小关系越近
        { source: 0, target: 1, relation: '朋友', value: 3 },
        { source: 0, target: 2, relation: '朋友', value: 3 },
        { source: 0, target: 3, relation: '朋友', value: 6 },
        { source: 1, target: 2, relation: '朋友', value: 6 },
        { source: 1, target: 3, relation: '朋友', value: 7 },
        { source: 2, target: 3, relation: '朋友', value: 7 },
        { source: 0, target: 4, relation: '朋友', value: 3 },
        { source: 0, target: 5, relation: '朋友', value: 3 },
        { source: 4, target: 5, relation: '夫妻', value: 1 },
        { source: 0, target: 6, relation: '兄弟', value: 2 },
        { source: 4, target: 6, relation: '同学', value: 3 },
      ]
    }
    const layout = {
      width:900,
      height: 400,
      tooltip: true,
      // tooltipline: true,
      // slider:true,
      legend:true,
      // curve: false,//将折线转化成条柔和的曲线
      barwidth: 100,
      // layout:"cluster",//"tree"
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
        {/* <Tree data={a} layout={layout}/> */}
        {/* <Pack data={a} layout={layout} /> */}
        {/* <Treemap data={a} layout={layout} /> */}
        {/* <Partition data={a} layout={layout} /> */}
        {/* <PartitionSun data={a} layout={layout} /> */}
        {/* <Chord data={chordata} layout={layout} /> */}
        {/* <Force data={forcedata} layout={layout} /> */}
        <Heatmap />
      </div>
    );
  }
}

export default App;
