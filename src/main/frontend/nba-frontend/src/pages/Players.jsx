import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Typography, Box, Card, CardContent, CardActions, Button, CircularProgress, Alert, TextField
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getAllPlayers } from '../services/api';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Verileri çekme (Fetch) işlemi
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getAllPlayers();
        setPlayers(data);
      } catch (err) {
        setError('Failed to load players');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Arama filtresi
  const filteredPlayers = players.filter(player =>
    player.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (player.playerSurname && player.playerSurname.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" color="primary">
          Players
        </Typography>
        <TextField
          label="Search Players"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>

      {/* Grid ve Kartlar (Liste) */}
      <Grid container spacing={3}>
        {filteredPlayers.map((player) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={player.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {player.playerName} {player.playerSurname}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Height: {player.height} cm
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Weight: {player.weight} kg
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Nationality: {player.nationality}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/players/${player.id}`}>View Profile</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {filteredPlayers.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ p: 2 }}>No players found matching "{searchTerm}".</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Players;