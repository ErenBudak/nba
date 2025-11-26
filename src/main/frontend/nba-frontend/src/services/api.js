import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8082/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the X-User-Id header
api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.id) {
            config.headers['X-User-Id'] = user.id;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getRecentGames = () => api.get('/games/recent').then(res => res.data);
export const getStandings = (seasonId) => {
    if (seasonId === undefined || seasonId === null) {
        return api.get('/games/standings').then(res => res.data);
    }
    return api.get(`/games/standings?seasonId=${seasonId}`).then(res => res.data);
};
export const getAllPlayers = () => api.get('/players').then(res => res.data);
export const getPlayerById = (id) => api.get(`/players/${id}`).then(res => res.data);
export const getPlayerStats = (id, seasonId) => api.get(`/players/${id}/stats?seasonId=${seasonId}`).then(res => res.data);
export const getGameLog = (id, seasonId) => api.get(`/players/${id}/gamelog?seasonId=${seasonId}`).then(res => res.data);
export const getAllTeams = () => api.get('/teams').then(res => res.data);
export const getTeamById = (id) => api.get(`/teams/${id}`).then(res => res.data);
export const getTeamRoster = (id, seasonId) => {
    if (seasonId === undefined || seasonId === null || seasonId === '') {
        return api.get(`/teams/${id}/roster`).then(res => res.data);
    }
    return api.get(`/teams/${id}/roster?seasonId=${seasonId}`).then(res => res.data);
};
export const getTeamGames = (id) => api.get(`/teams/${id}/games`).then(res => res.data);
export const getGameById = (id) => api.get(`/games/${id}`).then(res => res.data);
export const getBoxScore = (id) => api.get(`/games/${id}/boxscore`).then(res => res.data);
export const getFavorites = () => api.get('/favorites').then(res => res.data);
export const addFavoriteTeam = (teamId) => api.post(`/favorites/team/${teamId}`).then(res => res.data);
export const removeFavoriteTeam = (teamId) => api.delete(`/favorites/team/${teamId}`).then(res => res.data);
export const addFavoritePlayer = (playerId) => api.post(`/favorites/player/${playerId}`).then(res => res.data);
export const removeFavoritePlayer = (playerId) => api.delete(`/favorites/player/${playerId}`).then(res => res.data);
export const getMyProfile = () => api.get('/my-profile').then(res => res.data);
export const getAllGames = (seasonId, teamId) => {
    const params = new URLSearchParams();
    if (seasonId) params.append('seasonId', seasonId);
    if (teamId) params.append('teamId', teamId);
    return api.get(`/games?${params.toString()}`).then(res => res.data);
};
export const getAllSeasons = () => api.get('/games/seasons').then(res => res.data);
export const createPlayer = (player) => api.post('/players', player).then(res => res.data);
export const createTeam = (team) => api.post('/teams', team).then(res => res.data);
export const deletePlayer = (id) => api.delete(`/players/${id}`);
export const deleteTeam = (id) => api.delete(`/teams/${id}`);
export const createRoster = (roster) => api.post('/roster', roster).then(res => res.data);
export const createStats = (stats) => api.post('/stats', stats).then(res => res.data);
export const createGame = (game) => api.post('/games', game).then(res => res.data);
export const getAllDivisions = () => api.get('/teams/divisions').then(res => res.data);

export default api;
