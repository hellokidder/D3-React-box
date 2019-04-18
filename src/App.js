import React, { Component } from 'react';
import logo from './logo.svg';
import LineChartD3 from './D3-Box/line-chart'
import Line from './D3-Box/line'
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
    setline(2)
    const line = {}
    line.name = "A" + 3
    // line.color = "red"
        line.data = []
        for (let i = 0; i < 10; i += 1){
          const random = 10
          const dot = [i,random]
          line.data.push(dot)
        }
        lineData.push(line)
    console.log("lineData",lineData)

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <LineChartD3  data={a} />
        <Line data={lineData} />
      </div>
    );
  }
}

export default App;
