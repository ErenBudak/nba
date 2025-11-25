import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Card, CardContent, CircularProgress, Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getStandings, getRecentGames } from '../services/api';

const Dashboard = () => {
  const [standings, setStandings] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [standingsData, gamesData] = await Promise.all([
          getStandings(),
          getRecentGames()
        ]);

        // Debug: log raw responses to help diagnose empty/invalid payloads
        // eslint-disable-next-line no-console
        console.log('Dashboard: standingsData=', standingsData);
        // eslint-disable-next-line no-console
        console.log('Dashboard: gamesData=', gamesData);

        // Defensive assignment: ensure components always receive arrays
        const normalizedStandings = Array.isArray(standingsData)
          ? standingsData
          : (standingsData && Array.isArray(standingsData.data) ? standingsData.data : []);

        const normalizedGames = Array.isArray(gamesData)
          ? gamesData
          : (gamesData && Array.isArray(gamesData.data) ? gamesData.data : []);

        setStandings(normalizedStandings);
        setGames(normalizedGames);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: 'teamName', headerName: 'Team', width: 200 },
    { field: 'wins', headerName: 'W', type: 'number', width: 90 },
    { field: 'losses', headerName: 'L', type: 'number', width: 90 },
    {
      field: 'winPct',
      headerName: 'Pct',
      type: 'number',
      width: 90,
      valueFormatter: (value, row) => {
        const val = (value && typeof value === 'object' && value.value !== undefined)
          ? value.value
          : value;

        if (typeof val !== 'number' || isNaN(val)) return '0.0%';

        return `${(val * 100).toFixed(1)}%`;
      }
    },
  ];

  // Add unique ID for DataGrid if not present in data
  const rows = standings.map((team, index) => {
    // team object may come in different shapes; normalize team name and numeric fields
    const teamName = team.teamName || team.name || '';
    const wins = typeof team.wins === 'number' ? team.wins : Number(team.wins) || 0;
    const losses = typeof team.losses === 'number' ? team.losses : Number(team.losses) || 0;

    // Calculate win percentage directly from wins and losses for consistency
    let winPct = 0;
    if (wins + losses > 0) {
      winPct = wins / (wins + losses);
    }
    return {
      id: team.teamId || team.id || index,
      teamName,
      wins,
      losses,
      winPct,
      // keep original for debugging if needed
      _raw: team,
    };
  });

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
      <Grid container spacing={3}>
        {/* Recent Games Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Recent Games
            </Typography>
            <Grid container spacing={2}>
              {games.map((game) => {
                const fmtDate = game.date || '';
                const homeTeamStr = game.homeTeamName || '';
                const awayTeamStr = game.awayTeamName || '';
                const homeScore = game.homeScore ?? '';
                const awayScore = game.awayScore ?? '';

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
                    <Card elevation={3} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                      <CardContent>
                        <Typography variant="caption" display="block" align="center" color="text.secondary" gutterBottom>
                          {fmtDate}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{homeTeamStr}</Typography>
                          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>{homeScore}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{awayTeamStr}</Typography>
                          <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 'bold' }}>{awayScore}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
              {games.length === 0 && (
                <Typography variant="body1" sx={{ p: 2 }}>No recent games found.</Typography>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Standings Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Standings
            </Typography>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
