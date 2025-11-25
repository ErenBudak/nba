import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';

// --- BİLEŞEN IMPORTLARI (Dosya yollarını kendi projene göre kontrol et) ---
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Players from './pages/Players';
import PlayerProfile from './pages/PlayerProfile';
import Teams from './pages/Teams';
import TeamPage from './pages/TeamPage'; // veya TeamDetail
import Games from './pages/Games';
import GameDetail from './pages/GameDetail';
import AdminPage from './pages/AdminPage';
// ------------------------------------------------------------------------

// Tema ayarları burada düzgün bir değişkene atandı
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Player Routes */}
            <Route path="/players" element={<Players />} />
            <Route path="/players/:id" element={<PlayerProfile />} />

            {/* Team Routes */}
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:id" element={<TeamPage />} />

            {/* Game Routes */}
            <Route path="/games" element={<Games />} />
            <Route path="/games/:id" element={<GameDetail />} />

            {/* Admin Route */}
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;