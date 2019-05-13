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
  //  const a = {
  //   "name": "flare",
  //   "children": [
  //    {
  //     "name": "analytics",
  //     "children": [
  //      {
  //       "name": "cluster",
  //       "children": [
  //        {"name": "AgglomerativeCluster", "size": 3938},
  //        {"name": "CommunityStructure", "size": 3812},
  //        {"name": "HierarchicalCluster", "size": 6714},
  //        {"name": "MergeEdge", "size": 743}
  //       ]
  //      },
  //      {
  //       "name": "graph",
  //       "children": [
  //        {"name": "BetweennessCentrality", "size": 3534},
  //        {"name": "LinkDistance", "size": 5731},
  //        {"name": "MaxFlowMinCut", "size": 7840},
  //        {"name": "ShortestPaths", "size": 5914},
  //        {"name": "SpanningTree", "size": 3416}
  //       ]
  //      },
  //      {
  //       "name": "optimization",
  //       "children": [
  //        {"name": "AspectRatioBanker", "size": 7074}
  //       ]
  //      }
  //     ]
  //    },
  //    {
  //     "name": "animate",
  //     "children": [
  //      {"name": "Easing", "size": 17010},
  //      {"name": "FunctionSequence", "size": 5842},
  //      {
  //       "name": "interpolate",
  //       "children": [
  //        {"name": "ArrayInterpolator", "size": 1983},
  //        {"name": "ColorInterpolator", "size": 2047},
  //        {"name": "DateInterpolator", "size": 1375},
  //        {"name": "Interpolator", "size": 8746},
  //        {"name": "MatrixInterpolator", "size": 2202},
  //        {"name": "NumberInterpolator", "size": 1382},
  //        {"name": "ObjectInterpolator", "size": 1629},
  //        {"name": "PointInterpolator", "size": 1675},
  //        {"name": "RectangleInterpolator", "size": 2042}
  //       ]
  //      },
  //      {"name": "ISchedulable", "size": 1041},
  //      {"name": "Parallel", "size": 5176},
  //      {"name": "Pause", "size": 449},
  //      {"name": "Scheduler", "size": 5593},
  //      {"name": "Sequence", "size": 5534},
  //      {"name": "Transition", "size": 9201},
  //      {"name": "Transitioner", "size": 19975},
  //      {"name": "TransitionEvent", "size": 1116},
  //      {"name": "Tween", "size": 6006}
  //     ]
  //    },
  //    {
  //     "name": "data",
  //     "children": [
  //      {
  //       "name": "converters",
  //       "children": [
  //        {"name": "Converters", "size": 721},
  //        {"name": "DelimitedTextConverter", "size": 4294},
  //        {"name": "GraphMLConverter", "size": 9800},
  //        {"name": "IDataConverter", "size": 1314},
  //        {"name": "JSONConverter", "size": 2220}
  //       ]
  //      },
  //      {"name": "DataField", "size": 1759},
  //      {"name": "DataSchema", "size": 2165},
  //      {"name": "DataSet", "size": 586},
  //      {"name": "DataSource", "size": 3331},
  //      {"name": "DataTable", "size": 772},
  //      {"name": "DataUtil", "size": 3322}
  //     ]
  //    }
  //   ]
  //  }
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
      width:600,
      height: 400,
      // tooltip: true,
      // tooltipline: true,
      // slider:true,
      legend:false,
      // curve: true,//将折线转化成条柔和的曲线
      // barwidth: 40,
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        {/* <Line data={lineData} axis={axis} layout={layout} line={line} /> */}
        {/* <LineChart data={lineData} layout={layout} /> */}
        <PieChart data={pieData} layout={layout}/>
        {/* <BarChart data={barData} layout={layout}/> */}
        {/* <Tree data={b} /> */}
        {/* <Pack /> */}
      </div>
    );
  }
}

export default App;
