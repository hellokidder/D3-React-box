import React, { Component } from 'react';
import logo from './logo.svg';
import LineChartD3 from './D3-Box/line-chart'
import './App.css';

class App extends Component {
  render() {
    const Data = []
    for (let i = 0; i < 100; i += 1){
      const random = Math.floor(Math.random() * 100)
      Data.push(random)
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <LineChartD3  data={Data} />
        </header>
      </div>
    );
  }
}

export default App;
