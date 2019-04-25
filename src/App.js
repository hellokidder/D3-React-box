import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {lineData} from './D3-Box/config/config'
import Line from './D3-Box/Line'
class App extends Component {
  render() {
    const axis = {
      x: "X",
      // y:["B"]
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
        dot: true/false,
        color: "#ffffff"
      }
    ]
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Line data={lineData} axis={axis} tooltip={true} tooltipline={true} dot={true} layout={layout} line={line} />
      </div>
    );
  }
}

export default App;
