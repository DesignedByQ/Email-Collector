import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" Component={Home}/>
        <Route path="/:productId" Component={Home}/>
      </Routes>
    </Router>
  );
}

export default App;
