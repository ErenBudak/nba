import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Alert, MenuItem, Select, InputLabel, FormControl, Grid } from '@mui/material';
import { getAllGames, getAllPlayers, getTeamRoster, createStats } from '../services/api';

const AddStatsForm = ({ onSuccess }) => {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [formData, setFormData] = useState({
    gameId: '',
    playerId: '',
    teamId: '',
    points: 0,
    rebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    fieldGoalsMade: 0,
    fieldGoalsAttempted: 0,
    threePointersMade: 0,
    threePointersAttempted: 0,
    freeThrowsMade: 0,
    freeThrowsAttempted: 0,
    personalFouls: 0,
    minutesPlayed: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingTeam, setLoadingTeam] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesData, playersData] = await Promise.all([getAllGames(), getAllPlayers()]);
        setGames(gamesData);
        setPlayers(playersData);
      } catch (err) {
        console.error("Failed to load data", err);
        setError("Failed to load games or players.");
      }
    };
    fetchData();
  }, []);

  // Determine team when Game and Player are selected
  useEffect(() => {
    const determineTeam = async () => {
      if (!formData.gameId || !formData.playerId) return;

      setLoadingTeam(true);
      setError('');
      try {
        const selectedGame = games.find(g => g.id === formData.gameId);
        if (!selectedGame) return;

        // GameDTO is flat, so we access seasonId directly
        const seasonId = selectedGame.seasonId;
        if (!seasonId) {
          setError("Game season not found.");
          return;
        }

        // GameDTO is flat, so we access homeTeamId and awayTeamId directly
        const homeRoster = await getTeamRoster(selectedGame.homeTeamId, seasonId);
        const awayRoster = await getTeamRoster(selectedGame.awayTeamId, seasonId);
        console.log("Season ID:", seasonId);
        console.log("home Roster id", selectedGame.homeTeamId);
        console.log("away Roster id", selectedGame.awayTeamId);
        console.log("Home Roster:", homeRoster);
        console.log("Player ID to find:", formData.playerId);

        // Ensure we compare numbers
        const targetPlayerId = Number(formData.playerId);
        const playerInHome = homeRoster.find(r => r.player.id === targetPlayerId);
        const playerInAway = awayRoster.find(r => r.player.id === targetPlayerId);

        if (playerInHome) {
          setFormData(prev => ({ ...prev, teamId: selectedGame.homeTeamId }));
        } else if (playerInAway) {
          setFormData(prev => ({ ...prev, teamId: selectedGame.awayTeamId }));
        } else {
          setError("Selected player is not in the roster of either team for this game's season.");
          setFormData(prev => ({ ...prev, teamId: '' }));
        }
      } catch (err) {
        console.error("Failed to determine team", err);
        setError("Failed to determine player's team.");
      } finally {
        setLoadingTeam(false);
      }
    };

    determineTeam();
  }, [formData.gameId, formData.playerId, games]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.teamId) {
      setError("Could not determine team. Please check Game and Player selection.");
      return;
    }

    try {
      await createStats(formData);
      setSuccess('Stats added successfully!');
      setFormData(prev => ({
        ...prev,
        playerId: '',
        teamId: '',
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        threePointersMade: 0,
        threePointersAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        personalFouls: 0,
        minutesPlayed: 0
      }));
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError('Failed to add stats.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>Add Player Stats</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Game</InputLabel>
        <Select
          name="gameId"
          value={formData.gameId}
          label="Game"
          onChange={handleChange}
          required
        >
          {games.map((game) => (
            // Ensure game properties exist before rendering
            <MenuItem key={game.id} value={game.id}>
              {/* Robust rendering: check properties exist */}
              {game.date} - {game.homeTeamName || 'Unknown Home'} vs {game.awayTeamName || 'Unknown Away'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Player</InputLabel>
        <Select
          name="playerId"
          value={formData.playerId}
          label="Player"
          onChange={handleChange}
          required
        >
          {players.map((player) => (
            <MenuItem key={player.id} value={player.id}>
              {player.playerName} {player.playerSurname}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loadingTeam && <Typography variant="caption">Determining team...</Typography>}
      {formData.teamId && <Typography variant="caption" color="success.main" sx={{ display: 'block', mb: 2 }}>Team determined (ID: {formData.teamId})</Typography>}

      <Grid container spacing={2}>
        {['points', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'minutesPlayed', 'personalFouls'].map((field) => (
          <Grid item xs={6} sm={3} key={field}>
            <TextField
              fullWidth
              label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              type="number"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              size="small"
            />
          </Grid>
        ))}
        {['fieldGoalsMade', 'fieldGoalsAttempted', 'threePointersMade', 'threePointersAttempted', 'freeThrowsMade', 'freeThrowsAttempted'].map((field) => (
          <Grid item xs={6} sm={4} key={field}>
            <TextField
              fullWidth
              label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              type="number"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              size="small"
            />
          </Grid>
        ))}
      </Grid>

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} disabled={!formData.teamId || loadingTeam}>
        Add Stats
      </Button>
    </Box>
  );
};

export default AddStatsForm;
