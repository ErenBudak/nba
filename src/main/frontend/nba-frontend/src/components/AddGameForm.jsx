import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { getAllTeams, getAllSeasons, createGame } from '../services/api';

const AddGameForm = ({ onSuccess }) => {
  const [teams, setTeams] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    homeTeamId: '',
    awayTeamId: '',
    seasonId: '',
    gameType: 'Regular Season'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsData, seasonsData] = await Promise.all([getAllTeams(), getAllSeasons()]);
        setTeams(teamsData);
        setSeasons(seasonsData);
      } catch (err) {
        console.error("Failed to load data", err);
        setError("Failed to load teams or seasons.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.homeTeamId === formData.awayTeamId) {
      setError("Home and Away teams cannot be the same.");
      return;
    }

    try {
      await createGame(formData);
      setSuccess('Game created successfully!');
      setFormData({
        date: '',
        homeTeamId: '',
        awayTeamId: '',
        seasonId: '',
        gameType: 'Regular Season'
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError('Failed to create game. Please check inputs.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>Add New Game</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        fullWidth
        label="Date"
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        required
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Home Team</InputLabel>
        <Select
          name="homeTeamId"
          value={formData.homeTeamId}
          label="Home Team"
          onChange={handleChange}
          required
        >
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.name} ({team.city})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Away Team</InputLabel>
        <Select
          name="awayTeamId"
          value={formData.awayTeamId}
          label="Away Team"
          onChange={handleChange}
          required
        >
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.name} ({team.city})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Season</InputLabel>
        <Select
          name="seasonId"
          value={formData.seasonId}
          label="Season"
          onChange={handleChange}
          required
        >
          {seasons.map((season) => (
            <MenuItem key={season.id} value={season.id}>
              {season.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Game Type"
        name="gameType"
        value={formData.gameType}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />

      <Button type="submit" variant="contained" color="primary">
        Add Game
      </Button>
    </Box>
  );
};

export default AddGameForm;
