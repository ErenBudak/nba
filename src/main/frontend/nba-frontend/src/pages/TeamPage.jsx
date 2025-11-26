import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTeamById, getTeamRoster, getTeamGames, getAllSeasons } from '../services/api';
import { Link } from 'react-router-dom';

const TeamPage = () => {
    const { id } = useParams();
    const [team, setTeam] = useState([]);
    const [roster, setRoster] = useState([]);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const data = await getAllSeasons();
                setSeasons(data);
                if (data.length > 0) {
                    const latest = data.reduce((prev, curr) => prev.id > curr.id ? prev : curr);
                    setSelectedSeason(latest.id);
                }
            } catch (error) {
                console.error("Error fetching seasons:", error);
            }
        };
        fetchSeasons();
    }, []);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const teamRes = await getTeamById(id);
                setTeam(teamRes);
            } catch (error) {
                console.error("Error fetching team:", error);
                setTeam(null);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, [id]);

    useEffect(() => {
        // if (!selectedSeason) return; // Allow fetching if season is null (backend handles it)

        const fetchTeamData = async () => {
            try {
                try {
                    const rosterRes = await getTeamRoster(id, selectedSeason);
                    setRoster(rosterRes);
                } catch (e) {
                    console.warn("Roster not found for season", selectedSeason);
                    setRoster([]);
                }

                try {
                    const gamesRes = await getTeamGames(id);
                    const allGames = gamesRes;
                    const seasonGames = allGames.filter(g => g.seasonId === selectedSeason);
                    setGames(seasonGames);
                } catch (e) {
                    console.warn("Games not found");
                    setGames([]);
                }

            } catch (error) {
                console.error("Error fetching team data:", error);
            }
        };
        fetchTeamData();
    }, [id, selectedSeason]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen text-slate-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!team) return <div className="text-center p-10 text-slate-500">Team not found</div>;

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-lg p-8 text-white flex justify-between items-center">
                <div>
                    <h1 className="text-5xl font-black tracking-tight">{team.name}</h1>
                    <p className="text-xl text-slate-300 mt-2">{team.city} • {team.abbreviation}</p>
                </div>
                <div className="text-9xl font-black text-white opacity-10 hidden md:block">
                    {team.abbreviation}
                </div>
            </div>

            {/* Season Selector */}
            <div className="flex justify-end">
                <select
                    value={selectedSeason || ''}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                >
                    {seasons.map(season => (
                        <option key={season.id} value={season.id}>{season.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Roster */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="text-lg font-bold text-slate-800">Team Roster</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Player</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Pos</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Height</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Weight</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Exp</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {roster.map((item) => (
                                    <tr key={item.player.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link to={`/players/${item.player.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                                                {item.player.playerName} {item.player.playerSurname}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600">{item.position}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600">{item.player.height}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600">{item.player.weight}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600">{item.experience || 'R'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Schedule */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="text-lg font-bold text-slate-800">Schedule & Results</h2>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                        {games.map((game) => {
                            const isHome = game.homeTeamId === team.id;
                            const opponentId = isHome ? game.awayTeamId : game.homeTeamId;
                            const opponentName = isHome ? game.awayTeamName : game.homeTeamName;
                            const teamScore = isHome ? game.homeScore : game.awayScore;
                            const oppScore = isHome ? game.awayScore : game.homeScore;
                            const isWin = teamScore > oppScore;

                            return (
                                <div key={game.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 font-medium">{game.date}</span>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-xs font-bold text-slate-500">{isHome ? 'vs' : '@'}</span>
                                            <Link to={`/teams/${opponentId}`} className="font-bold text-slate-900 hover:text-blue-600">
                                                {opponentName}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        {game.homeScore !== null ? (
                                            <>
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${isWin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {isWin ? 'W' : 'L'}
                                                </span>
                                                <span className="font-mono font-bold text-slate-900">{teamScore}-{oppScore}</span>
                                            </>
                                        ) : (
                                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Upcoming</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamPage;
