import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import jsCookie from 'js-cookie';
import HomePage from './pages/homePage.jsx';
import Login from './pages/login.jsx';
import SignUp from './pages/signup.jsx';


function App() {


  return (
    <Routes basename="/login">
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
    </Routes>
  )
}

export default App
