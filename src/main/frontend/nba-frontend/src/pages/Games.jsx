import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Typography, Box, Card, CardContent, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { getAllGames, getAllSeasons, getAllTeams } from '../services/api';
import { Link } from 'react-router-dom';

const Games = () => {
  const [games, setGames] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [seasonsData, teamsData] = await Promise.all([getAllSeasons(), getAllTeams()]);
        setSeasons(seasonsData);
        setTeams(teamsData);

        // Set default season to the latest one if available
        if (seasonsData.length > 0) {
          // Assuming seasons are sorted or we find the max ID
          const latestSeason = seasonsData.reduce((prev, current) => (prev.id > current.id) ? prev : current);
          setSelectedSeason(latestSeason.id);
        }
      } catch (err) {
        console.error("Failed to load filters", err);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const data = await getAllGames(selectedSeason, selectedTeam);
        setGames(data);
      } catch (err) {
        setError('Failed to load games');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [selectedSeason, selectedTeam]);

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" color="primary">
          Games
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="season-select-label">Season</InputLabel>
            <Select
              labelId="season-select-label"
              id="season-select"
              value={selectedSeason}
              label="Season"
              onChange={handleSeasonChange}
            >
              <MenuItem value=""><em>All Seasons</em></MenuItem>
              {seasons.map((season) => (
                <MenuItem key={season.id} value={season.id}>
                  {season.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="team-select-label">Team</InputLabel>
            <Select
              labelId="team-select-label"
              id="team-select"
              value={selectedTeam}
              label="Team"
              onChange={handleTeamChange}
            >
              <MenuItem value=""><em>All Teams</em></MenuItem>
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={2}>
          {games.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ p: 2 }}>No games found.</Typography>
            </Grid>
          ) : (
            games.map((game) => (
              <Grid item xs={12} md={6} lg={4} key={game.id}>
                <Card
                  elevation={3}
                  sx={{ borderRadius: 2, border: '1px solid #e0e0e0', transition: '0.3s', '&:hover': { boxShadow: 6 }, cursor: 'pointer', textDecoration: 'none' }}
                  component={Link}
                  to={`/games/${game.id}`}
                >
                  <CardContent>
                    <Typography variant="caption" display="block" align="center" color="text.secondary" gutterBottom>
                      {game.date}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Box sx={{ textAlign: 'center', flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{game.homeTeamName}</Typography>
                        <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>{game.homeScore ?? '-'}</Typography>
                      </Box>
                      <Typography variant="h6" color="text.secondary" sx={{ mx: 2 }}>VS</Typography>
                      <Box sx={{ textAlign: 'center', flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{game.awayTeamName}</Typography>
                        <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 'bold' }}>{game.awayScore ?? '-'}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Container>
  );
};

export default Games;
