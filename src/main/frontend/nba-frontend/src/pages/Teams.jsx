import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Typography, Box, Card, CardContent, CardActions, Button, CircularProgress, Alert, IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getAllTeams, addFavoriteTeam, removeFavoriteTeam, getMyProfile } from '../services/api';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../context/AuthContext';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const { user } = useAuth();

  useEffect(() => {
    const fetchTeamsAndFavorites = async () => {
      try {
        const [teamsData, profileData] = await Promise.all([
          getAllTeams(),
          user ? getMyProfile().catch(() => null) : Promise.resolve(null)
        ]);
        setTeams(teamsData);

        if (profileData && profileData.favoriteTeams) {
          const favIds = new Set(profileData.favoriteTeams.map(f => f.teamId));
          setFavorites(favIds);
        }
      } catch (err) {
        setError('Failed to load teams');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsAndFavorites();
  }, [user]);

  const handleToggleFavorite = async (teamId) => {
    if (!user) return;

    try {
      if (favorites.has(teamId)) {
        await removeFavoriteTeam(teamId);
        setFavorites(prev => {
          const newFavs = new Set(prev);
          newFavs.delete(teamId);
          return newFavs;
        });
      } else {
        await addFavoriteTeam(teamId);
        setFavorites(prev => {
          const newFavs = new Set(prev);
          newFavs.add(teamId);
          return newFavs;
        });
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

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
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button size="small" component={Link} to={`/teams/${team.id}`}>View Details</Button>
                {user && (
                  <IconButton onClick={() => handleToggleFavorite(team.id)} color="secondary">
                    {favorites.has(team.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Teams;
