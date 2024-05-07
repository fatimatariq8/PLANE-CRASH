import React from 'react';
import MyComponent from './MyComponent';
import './App.css'; // Assuming you have a CSS file for styling

function App() {
  return (
    <div className="App">
      <div className="header">
        <h1>Welcome To Plane Crash Database</h1>
      </div>
      <div className="content">
        <MyComponent />
      </div>
    </div>
  );
}

export default App;
