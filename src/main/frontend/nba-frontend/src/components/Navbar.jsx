import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SportsBasketballIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            NBA STATS
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Button component={RouterLink} to="/" sx={{ my: 2, color: 'white', display: 'block' }}>
              Dashboard
            </Button>
            <Button component={RouterLink} to="/players" sx={{ my: 2, color: 'white', display: 'block' }}>
              Players
            </Button>
            <Button component={RouterLink} to="/teams" sx={{ my: 2, color: 'white', display: 'block' }}>
              Teams
            </Button>
            <Button component={RouterLink} to="/games" sx={{ my: 2, color: 'white', display: 'block' }}>
              Games
            </Button>
            {user?.role === 'ADMIN' && (
              <Button component={RouterLink} to="/admin" sx={{ my: 2, color: 'white', display: 'block', border: '1px solid white', ml: 2 }}>
                Admin
              </Button>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Welcome, {user.username} ({user.role})
                </Typography>
                <Button component={RouterLink} to="/profile" color="inherit" variant="text">
                  Profile
                </Button>
                <Button onClick={handleLogout} color="inherit" variant="outlined" size="small">
                  Logout
                </Button>
              </Box>
            ) : (
              <Box>
                <Button component={RouterLink} to="/login" color="inherit">
                  Login
                </Button>
                <Button component={RouterLink} to="/register" color="inherit">
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
