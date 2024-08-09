import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage.jsx';
import Login from './pages/login.jsx';
import SignUp from './pages/signup.jsx';
import HistoryPage from './pages/history.jsx';
import LikePage from './pages/likePage.jsx';
import MyContentPage from './pages/MyContentPage.jsx';
import jsCookie from 'js-cookie';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(jsCookie.get('authenticated') ? true : false);
  if(isAuthenticated) {
    jsCookie.set('authenticated', true);
  }

  return (
    <Routes basename="/">
      <Route path='/' element={<HomePage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/login' element={<Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/signup' element={<SignUp isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/history' element={<HistoryPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/liked-videos' element={<LikePage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/my-content' element={<MyContentPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
    </Routes>
  )
}

export default App
