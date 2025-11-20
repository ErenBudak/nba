import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getRecentGames = () => api.get('/games/recent');
export const getStandings = (seasonId) => api.get(`/games/standings?seasonId=${seasonId}`);
export const getAllPlayers = () => api.get('/players');
export const getPlayerById = (id) => api.get(`/players/${id}`);
export const getPlayerStats = (id, seasonId) => api.get(`/players/${id}/stats?seasonId=${seasonId}`);
export const getGameLog = (id, seasonId) => api.get(`/players/${id}/gamelog?seasonId=${seasonId}`);
export const getAllTeams = () => api.get('/teams');
export const getTeamById = (id) => api.get(`/teams/${id}`);
export const getTeamRoster = (id, seasonId) => api.get(`/teams/${id}/roster?seasonId=${seasonId}`);
export const getTeamGames = (id) => api.get(`/teams/${id}/games`);
export const getGameById = (id) => api.get(`/games/${id}`);
export const getBoxScore = (id) => api.get(`/games/${id}/boxscore`);

export default api;
