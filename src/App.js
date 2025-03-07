import React from 'react';
import ComponentBrowser from './components/ComponentBrowser';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>算法可视化演示平台</h1>
      </header>
      <main>
        <ComponentBrowser />
      </main>
    </div>
  );
}

export default App; 