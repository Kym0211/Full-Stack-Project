import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage.jsx';
import Login from './pages/loginPage.jsx';
import SignUp from './pages/signupPage.jsx';
import HistoryPage from './pages/historyPage.jsx';
import LikePage from './pages/likePage.jsx';
import MyContentPage from './pages/MyContentPage.jsx';
import PlaylistPage from './pages/PlaylistPage.jsx';
import SubscriptionsPage from './pages/SubscriptionsPage.jsx';
import SettingsPage from './pages/settingsPage.jsx';
import DashboardPage from './pages/dashboardPage.jsx';
import VideoPage from './pages/videoPage.jsx';
import jsCookie from 'js-cookie';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(jsCookie.get('accessToken') ? true : false);
  if(!jsCookie.get('accessToken') && isAuthenticated === true) {
    setIsAuthenticated(false);
  }
  return (
    <Routes basename="/">
      <Route path='/' element={<HomePage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/login' element={<Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/signup' element={<SignUp isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/history' element={<HistoryPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/liked-videos' element={<LikePage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/my-content' element={<MyContentPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/playlist' element={<PlaylistPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/subscriptions' element={<SubscriptionsPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/settings' element={<SettingsPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/dashboard' element={<DashboardPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path='/video/:videoId' element={<VideoPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
    </Routes>
  )
}

export default App
