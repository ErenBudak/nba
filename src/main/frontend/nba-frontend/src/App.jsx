import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PlayerProfile from './pages/PlayerProfile';
import TeamPage from './pages/TeamPage';
import GameDetail from './pages/GameDetail';
import Players from './pages/Players';
import Teams from './pages/Teams';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/players" element={<Players />} />
            <Route path="/players/:id" element={<PlayerProfile />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:id" element={<TeamPage />} />
            <Route path="/games/:id" element={<GameDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
