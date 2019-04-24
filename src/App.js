import React, { Component } from 'react';
import logo from './logo.svg';
// import LineChartD3 from './D3-Box/line-chart'
import Line from './D3-Box/line'
// import Tree from './D3-Box/Tree'
// import Pie from './D3-Box/Pie'
// import Bar from './D3-Box/Bar'
import './App.css';

class App extends Component {
  render() {
    const a = []
    for (let i = 0; i < 2; i += 1){
      const Data = []
      for (let i = 0; i < 10; i += 1){
        const random = Math.floor(Math.random() * 100)
        Data.push(random)
      }
      a.push(Data)
    }
    const lineData = []
    function setline (num) {
      for (let n = 0; n < num; n += 1){
        const line = {}
        line.name = "A"+n
        line.data = []
        for (let i = 0; i < 10; i += 1){
          const random = Math.floor(Math.random() * 100)
          const dot = [i,random]
          line.data.push(dot)
        }
        lineData.push(line)
      }
    }
    setline(5)
    // const line = {}
    // line.name = "A" + 3
    // line.color = "blue"
    //     line.data = []
    //     for (let i = 0; i < 10; i += 1){
    //       const random = 10
    //       const dot = [i,random]
    //       line.data.push(dot)
    //     }
    // lineData.push(line)
    // const barData = [4, 8, 15, 16, 23, 42];
    // const treeData = {
    //   name: "中国",
    //   children: [
    //     {
    //       name: "浙江",
    //       children: [
    //         { name: "杭州", value: 100 },
    //         { name: "宁波", value: 100 },
    //         { name: "温州", value: 100 },
    //         { name: "绍兴", value: 100 }
    //       ]
    //     },
    //     {
    //       name: "广西",
    //       children: [
    //         {
    //           name: "桂林",
    //           children: [
    //             { name: "秀峰区", value: 100 },
    //             { name: "叠彩区", value: 100 },
    //             { name: "象山区", value: 100 },
    //             { name: "七星区", value: 100 }
    //           ]
    //         },
    //         { name: "南宁", value: 100 },
    //         { name: "柳州", value: 100 },
    //         { name: "防城港", value: 100 }
    //       ]
    //     },
    //     {
    //       name: "黑龙江",
    //       children: [
    //         { name: "哈尔滨", value: 100 },
    //         { name: "齐齐哈尔", value: 100 },
    //         { name: "牡丹江", value: 100 },
    //         { name: "大庆", value: 100 }
    //       ]
    //     },
    //     {
    //       name: "新疆",
    //       children:
    //         [
    //           { name: "乌鲁木齐" },
    //           { name: "克拉玛依" },
    //           { name: "吐鲁番" },
    //           { name: "哈密" }
    //         ]
    //     }
    //   ]
    // }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        {/* <LineChartD3  data={a} /> */}
        <Line data={lineData} />
        {/* <Tree data={treeData} /> */}
        {/* <Bar data={barData} />
        <Pie /> */}
      </div>
    );
  }
}

export default App;
