import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {lineData} from './D3-Box/config/config'
import Line from './D3-Box/Line'
class App extends Component {
  render() {
    const axis = {
      x:"X"
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Line data={lineData} axis={axis} />
      </div>
    );
  }
}

export default App;
