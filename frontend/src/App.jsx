import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import jsCookie from 'js-cookie';
import HomePage from './pages/homePage.jsx';
import Login from './pages/login.jsx';
import SignUp from './pages/signup.jsx';
import HistoryPage from './pages/history.jsx';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  return (
    <Routes basename="/">
      <Route path='/' element={<HomePage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/login' element={<Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/signup' element={<SignUp isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/history' element={<HistoryPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
    </Routes>
  )
}

export default App
