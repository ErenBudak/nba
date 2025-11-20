import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlayerById, getPlayerStats, getGameLog } from '../services/api';

const PlayerProfile = () => {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [stats, setStats] = useState(null);
    const [gameLog, setGameLog] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const playerRes = await getPlayerById(id);
                setPlayer(playerRes.data);

                const statsRes = await getPlayerStats(id, 1); // Assuming season 1
                setStats(statsRes.data);

                const logRes = await getGameLog(id, 1);
                setGameLog(logRes.data);
            } catch (error) {
                console.error("Error fetching player data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen text-slate-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!player) return <div className="text-center p-10 text-slate-500">Player not found</div>;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header / Bio Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                <div className="h-32 w-32 rounded-full bg-slate-200 flex items-center justify-center text-4xl font-bold text-slate-400 border-4 border-white shadow-lg">
                    {player.playerName.charAt(0)}{player.playerSurname.charAt(0)}
                </div>
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-4xl font-bold text-slate-900">{player.playerName} {player.playerSurname}</h1>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-600">
                        <span className="bg-slate-100 px-3 py-1 rounded-full">Height: <span className="font-semibold text-slate-900">{player.height} cm</span></span>
                        <span className="bg-slate-100 px-3 py-1 rounded-full">Weight: <span className="font-semibold text-slate-900">{player.weight} kg</span></span>
                        <span className="bg-slate-100 px-3 py-1 rounded-full">Nationality: <span className="font-semibold text-slate-900">{player.nationality}</span></span>
                        <span className="bg-slate-100 px-3 py-1 rounded-full">Draft: <span className="font-semibold text-slate-900">{player.draftYear || 'Undrafted'}</span></span>
                    </div>
                </div>
                <div className="text-center md:text-right">
                     {/* Placeholder for team logo or jersey number if available */}
                     <div className="text-6xl font-black text-slate-100">#{player.id}</div>
                </div>
            </div>

            {/* Season Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="PPG" value={stats?.ppg} />
                <StatCard label="RPG" value={stats?.rpg} />
                <StatCard label="APG" value={stats?.apg} />
                <StatCard label="FG%" value={stats?.fgPercentage ? `${(stats.fgPercentage * 100).toFixed(1)}%` : '-'} />
            </div>

            {/* Game Log */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800">Game Log</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase">Opponent</th>
                                <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase">MIN</th>
                                <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase">PTS</th>
                                <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase">REB</th>
                                <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase">AST</th>
                                <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase">STL</th>
                                <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase">BLK</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {gameLog.map((game) => (
                                <tr key={game.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{game.game.date}</td>
                                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">
                                        vs {game.game.homeTeam.id === game.team.id ? game.game.awayTeam.abbreviation : game.game.homeTeam.abbreviation}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-slate-600">{game.minutes}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center font-bold text-slate-900">{game.points}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-slate-600">{game.totalRebounds}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-slate-600">{game.assists}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-slate-600">{game.steals}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-slate-600">{game.blocks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center">
        <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">{label}</span>
        <span className="text-3xl font-black text-slate-900 mt-1">{value !== undefined ? value : '-'}</span>
    </div>
);

export default PlayerProfile;
