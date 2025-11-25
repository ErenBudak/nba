import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Typography, Box, Card, CardContent, CardActions, Button, CircularProgress, Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getAllTeams } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getAllTeams();
        setTeams(data);
      } catch (err) {
        setError('Failed to load teams');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

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
          Teams
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {teams.map((team) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={team.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {team.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {team.city}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Abbreviation: {team.abbreviation}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/teams/${team.id}`}>View Details</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Teams;
