import React, { useEffect, useState } from 'react';
import { getRecentGames, getStandings } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [standings, setStandings] = useState([]);
    const [recentGames, setRecentGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [seasonId, setSeasonId] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const standingsData = await getStandings(seasonId);
                setStandings(standingsData.data);
                
                const gamesData = await getRecentGames();
                setRecentGames(gamesData.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [seasonId]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen text-slate-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">NBA Dashboard</h1>
                    <p className="text-slate-500 mt-1">Season 2024-2025 Overview</p>
                </div>
                <div className="text-sm text-slate-400">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Standings Card */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Conference Standings</h2>
                        <select 
                            className="text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            value={seasonId}
                            onChange={(e) => setSeasonId(e.target.value)}
                        >
                            <option value="1">2024-25</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Team</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">W</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">L</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Pct</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Conf</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {standings.map((team, index) => (
                                    <tr key={team.teamId} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-slate-400 w-6 text-sm">{index + 1}</span>
                                                <Link to={`/teams/${team.teamId}`} className="font-semibold text-slate-900 hover:text-blue-600">
                                                    {team.teamName}
                                                </Link>
                                                <span className="ml-2 text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{team.teamAbbreviation}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-slate-900">{team.wins}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500">{team.losses}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-900 font-bold">{(team.winPercentage * 100).toFixed(1)}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500">{team.conference}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Games Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="text-lg font-bold text-slate-800">Recent Games</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentGames.map((game) => (
                            <div key={game.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{game.gameType}</span>
                                    <span className="text-xs text-slate-400">{game.date}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <span className={`font-bold text-lg ${game.homeScore > game.awayScore ? 'text-slate-900' : 'text-slate-500'}`}>
                                            {game.homeTeam.abbreviation}
                                        </span>
                                        <span className={`text-xl font-bold ${game.homeScore > game.awayScore ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {game.homeScore}
                                        </span>
                                    </div>
                                    <span className="text-slate-300 text-sm font-medium">vs</span>
                                    <div className="flex items-center space-x-3">
                                        <span className={`text-xl font-bold ${game.awayScore > game.homeScore ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {game.awayScore}
                                        </span>
                                        <span className={`font-bold text-lg ${game.awayScore > game.homeScore ? 'text-slate-900' : 'text-slate-500'}`}>
                                            {game.awayTeam.abbreviation}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link to={`/games/${game.id}`} className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">
                                        View Box Score &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                        <Link to="/games" className="text-sm font-medium text-blue-600 hover:text-blue-800">View Full Schedule</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
