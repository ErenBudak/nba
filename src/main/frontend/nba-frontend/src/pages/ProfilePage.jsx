import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { getMyProfile, removeFavoriteTeam, removeFavoritePlayer } from '../services/api';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch profile", err);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTeam = async (teamId) => {
    try {
      await removeFavoriteTeam(teamId);
      fetchProfile(); // Refresh list
    } catch (err) {
      console.error("Failed to remove team", err);
    }
  };

  const handleRemovePlayer = async (playerId) => {
    try {
      await removeFavoritePlayer(playerId);
      fetchProfile(); // Refresh list
    } catch (err) {
      console.error("Failed to remove player", err);
    }
  };

  if (loading) return <Typography sx={{ color: 'white', p: 3 }}>Loading profile...</Typography>;
  if (error) return <Typography sx={{ color: 'red', p: 3 }}>{error}</Typography>;
  if (!profile) return <Typography sx={{ color: 'white', p: 3 }}>No profile data found.</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#1e1e1e', color: 'white' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#f50057' }}>
          My Profile
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: '#2d2d2d', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>User Details</Typography>
                <Typography><strong>Username:</strong> {profile.username}</Typography>
                <Typography><strong>Email:</strong> {profile.email}</Typography>
                <Typography><strong>Role:</strong> {profile.role}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ mt: 3, mb: 2, color: '#f50057' }}>Favorite Teams</Typography>
            {profile.favoriteTeams && profile.favoriteTeams.length > 0 ? (
              <List sx={{ backgroundColor: '#2d2d2d', borderRadius: 1 }}>
                {profile.favoriteTeams.map((fav) => (
                  <ListItem key={fav.teamId} divider>
                    <ListItemText
                      primary={fav.team ? fav.team.name : `Team ID: ${fav.teamId}`}
                      secondary={fav.team ? `${fav.team.city} ${fav.team.abbreviation}` : ''}
                      primaryTypographyProps={{ color: 'white' }}
                      secondaryTypographyProps={{ color: 'gray' }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTeam(fav.teamId)} sx={{ color: '#f50057' }}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography sx={{ color: 'gray' }}>No favorite teams yet.</Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ mt: 3, mb: 2, color: '#f50057' }}>Favorite Players</Typography>
            {profile.favoritePlayers && profile.favoritePlayers.length > 0 ? (
              <List sx={{ backgroundColor: '#2d2d2d', borderRadius: 1 }}>
                {profile.favoritePlayers.map((fav) => (
                  <ListItem key={fav.playerId} divider>
                    <ListItemText
                      primary={fav.player ? fav.player.playerName : `Player ID: ${fav.playerId}`}
                      secondary={fav.player ? `${fav.player.position} - ${fav.player.jerseyNumber}` : ''}
                      primaryTypographyProps={{ color: 'white' }}
                      secondaryTypographyProps={{ color: 'gray' }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemovePlayer(fav.playerId)} sx={{ color: '#f50057' }}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography sx={{ color: 'gray' }}>No favorite players yet.</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
