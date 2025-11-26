import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Tabs, Tab, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Grid, Paper, Alert, Snackbar
} from '@mui/material';
import {
  createTeam, createPlayer, createRoster, createStats,
  getAllDivisions, getAllTeams, getAllPlayers, getAllSeasons, getAllGames
} from '../services/api';
import AddGameForm from '../components/AddGameForm';
import AddStatsForm from '../components/AddStatsForm';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import {
  List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteTeam, deletePlayer, deleteGame } from '../services/api';

const AdminPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
        Admin Dashboard
      </Typography>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
          <Tab label="Create Team" />
          <Tab label="Create Player" />
          <Tab label="Manage Roster" />
          <Tab label="Add Game" />
          <Tab label="Add Stats" />
          <Tab label="Manage Teams" />
          <Tab label="Manage Players" />
          <Tab label="Manage Games" />
        </Tabs>
      </Paper>

      <Box hidden={tabValue !== 0}>
        {tabValue === 0 && <CreateTeamForm onSuccess={showNotification} />}
      </Box>
      <Box hidden={tabValue !== 1}>
        {tabValue === 1 && <CreatePlayerForm onSuccess={showNotification} />}
      </Box>
      <Box hidden={tabValue !== 2}>
        {tabValue === 2 && <CreateRosterForm onSuccess={showNotification} />}
      </Box>
      <Box hidden={tabValue !== 3}>
        {tabValue === 3 && <AddGameForm onSuccess={() => showNotification('Game created successfully!')} />}
      </Box>
      <Box hidden={tabValue !== 4}>
        {tabValue === 4 && <AddStatsForm onSuccess={() => showNotification('Stats added successfully!')} />}
      </Box>
      <Box hidden={tabValue !== 5}>
        {tabValue === 5 && <ManageTeams onSuccess={showNotification} />}
      </Box>
      <Box hidden={tabValue !== 6}>
        {tabValue === 6 && <ManagePlayers onSuccess={showNotification} />}
      </Box>
      <Box hidden={tabValue !== 7}>
        {tabValue === 7 && <ManageGames onSuccess={showNotification} />}
      </Box>

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

const CreateTeamForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', abbreviation: '', city: '', divisionId: '' });
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    getAllDivisions().then(setDivisions).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTeam(formData);
      onSuccess('Team created successfully!');
      setFormData({ name: '', abbreviation: '', city: '', divisionId: '' });
    } catch (error) {
      onSuccess('Failed to create team: ' + error.message, 'error');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Team Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Abbreviation" value={formData.abbreviation} onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })} required inputProps={{ maxLength: 3 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Division</InputLabel>
              <Select value={formData.divisionId} label="Division" onChange={(e) => setFormData({ ...formData, divisionId: e.target.value })}>
                {divisions.map(div => (
                  <MenuItem key={div.id} value={div.id}>{div.name} ({div.conferenceName})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>Create Team</Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

const CreatePlayerForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    playerName: '', playerSurname: '', birthDay: '', height: '', weight: '',
    nationality: '', draftYear: '', draftOrder: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPlayer(formData);
      onSuccess('Player created successfully!');
      setFormData({ playerName: '', playerSurname: '', birthDay: '', height: '', weight: '', nationality: '', draftYear: '', draftOrder: '' });
    } catch (error) {
      onSuccess('Failed to create player: ' + error.message, 'error');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="First Name" value={formData.playerName} onChange={(e) => setFormData({ ...formData, playerName: e.target.value })} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Last Name" value={formData.playerSurname} onChange={(e) => setFormData({ ...formData, playerSurname: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Birth Day" InputLabelProps={{ shrink: true }} value={formData.birthDay} onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Height (cm)" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Weight (kg)" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Nationality" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Draft Year" value={formData.draftYear} onChange={(e) => setFormData({ ...formData, draftYear: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Draft Order" value={formData.draftOrder} onChange={(e) => setFormData({ ...formData, draftOrder: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>Create Player</Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

const CreateRosterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ playerId: '', teamId: '', seasonId: '', jerseyNumber: '', position: '' });
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    getAllPlayers().then(setPlayers).catch(console.error);
    getAllTeams().then(setTeams).catch(console.error);
    getAllSeasons().then(setSeasons).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRoster(formData);
      onSuccess('Roster entry created successfully!');
      setFormData({ ...formData, playerId: '', jerseyNumber: '', position: '' }); // Keep team/season selected
    } catch (error) {
      onSuccess('Failed to add to roster: ' + error.message, 'error');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Season</InputLabel>
              <Select value={formData.seasonId} label="Season" onChange={(e) => setFormData({ ...formData, seasonId: e.target.value })}>
                {seasons.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Team</InputLabel>
              <Select value={formData.teamId} label="Team" onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}>
                {teams.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Player</InputLabel>
              <Select value={formData.playerId} label="Player" onChange={(e) => setFormData({ ...formData, playerId: e.target.value })}>
                {players.map(p => <MenuItem key={p.id} value={p.id}>{p.playerName} {p.playerSurname}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Jersey Number" value={formData.jerseyNumber} onChange={(e) => setFormData({ ...formData, jerseyNumber: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Position</InputLabel>
              <Select value={formData.position} label="Position" onChange={(e) => setFormData({ ...formData, position: e.target.value })}>
                <MenuItem value="PG">Point Guard</MenuItem>
                <MenuItem value="SG">Shooting Guard</MenuItem>
                <MenuItem value="SF">Small Forward</MenuItem>
                <MenuItem value="PF">Power Forward</MenuItem>
                <MenuItem value="C">Center</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>Add to Roster</Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};



export default AdminPage;

const ManageTeams = ({ onSuccess }) => {
  const [teams, setTeams] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = () => {
    getAllTeams().then(setTeams).catch(console.error);
  };

  const handleDeleteClick = (team) => {
    setSelectedItem(team);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteTeam(selectedItem.id);
      setTeams(teams.filter(t => t.id !== selectedItem.id));
      onSuccess('Team deleted successfully!');
    } catch (error) {
      onSuccess('Failed to delete team: ' + error.message, 'error');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Manage Teams</Typography>
      <List>
        {teams.map((team) => (
          <React.Fragment key={team.id}>
            <ListItem>
              <ListItemText primary={team.name} secondary={`${team.city} - ${team.abbreviation}`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(team)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Team"
        content={`Are you sure you want to delete ${selectedItem?.name}?`}
      />
    </Paper>
  );
};

const ManagePlayers = ({ onSuccess }) => {
  const [players, setPlayers] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = () => {
    getAllPlayers().then(setPlayers).catch(console.error);
  };

  const handleDeleteClick = (player) => {
    setSelectedItem(player);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await deletePlayer(selectedItem.id);
      setPlayers(players.filter(p => p.id !== selectedItem.id));
      onSuccess('Player deleted successfully!');
    } catch (error) {
      onSuccess('Failed to delete player: ' + error.message, 'error');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Manage Players</Typography>
      <List>
        {players.map((player) => (
          <React.Fragment key={player.id}>
            <ListItem>
              <ListItemText primary={`${player.playerName} ${player.playerSurname}`} secondary={`Height: ${player.height}cm, Weight: ${player.weight}kg`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(player)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Player"
        content={`Are you sure you want to delete ${selectedItem?.playerName} ${selectedItem?.playerSurname}?`}
      />
    </Paper>
  );
};

const ManageGames = ({ onSuccess }) => {
  const [games, setGames] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getAllSeasons().then(setSeasons).catch(console.error);
    loadGames();
  }, []);

  useEffect(() => {
    loadGames();
  }, [selectedSeason]);

  const loadGames = () => {
    getAllGames(selectedSeason || null).then(setGames).catch(console.error);
  };

  const handleDeleteClick = (game) => {
    setSelectedItem(game);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteGame(selectedItem.id);
      setGames(games.filter(g => g.id !== selectedItem.id));
      onSuccess('Game deleted successfully!');
    } catch (error) {
      onSuccess('Failed to delete game: ' + error.message, 'error');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Manage Games</Typography>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Filter by Season</InputLabel>
          <Select
            value={selectedSeason}
            label="Filter by Season"
            onChange={(e) => setSelectedSeason(e.target.value)}
          >
            <MenuItem value="">
              <em>All Seasons</em>
            </MenuItem>
            {seasons.map((season) => (
              <MenuItem key={season.id} value={season.id}>
                {season.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <List>
        {games.map((game) => (
          <React.Fragment key={game.id}>
            <ListItem>
              <ListItemText
                primary={`${game.homeTeamName} vs ${game.awayTeamName}`}
                secondary={`${game.date} - ${game.gameType} (${game.homeScore || 0} - ${game.awayScore || 0})`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(game)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Game"
        content={`Are you sure you want to delete ${selectedItem?.homeTeamName} vs ${selectedItem?.awayTeamName}?`}
      />
    </Paper>
  );
};
