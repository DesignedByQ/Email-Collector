import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="https://www.suavecollections.com" element={<Home />} />  
        <Route path="https://www.suavecollections.com/:productId" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
