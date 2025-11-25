import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBoxScore, getGameById } from '../services/api';

const GameDetail = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [boxScore, setBoxScore] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const gameRes = await getGameById(id);
                setGame(gameRes);

                const boxScoreRes = await getBoxScore(id);
                setBoxScore(boxScoreRes);
            } catch (error) {
                console.error("Error fetching game data:", error);
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

    if (!game) return <div className="text-center p-10 text-slate-500">Game not found</div>;

    if (!game) return <div className="text-center p-10 text-slate-500">Game not found</div>;

    const homeStats = boxScore.filter(stat => stat.teamId === game.homeTeamId);
    const awayStats = boxScore.filter(stat => stat.teamId === game.awayTeamId);

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Scoreboard */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex justify-between items-center text-center">
                    <div className="flex-1">
                        <Link to={`/teams/${game.homeTeamId}`} className="text-3xl font-black text-slate-900 hover:text-blue-600 block">
                            {game.homeTeamName}
                        </Link>
                        <div className="text-slate-500 text-sm mt-1">{game.homeTeamName}</div>
                    </div>
                    <div className="px-8">
                        <div className="text-5xl font-black text-slate-900 tracking-tight">
                            {game.homeScore} <span className="text-slate-300 mx-2">-</span> {game.awayScore}
                        </div>
                        <div className="text-slate-400 font-medium mt-2 uppercase tracking-wider text-sm">{game.gameType} • Final</div>
                    </div>
                    <div className="flex-1">
                        <Link to={`/teams/${game.awayTeamId}`} className="text-3xl font-black text-slate-900 hover:text-blue-600 block">
                            {game.awayTeamName}
                        </Link>
                        <div className="text-slate-500 text-sm mt-1">{game.awayTeamName}</div>
                    </div>
                </div>
            </div>

            {/* Box Scores */}
            <div className="grid grid-cols-1 gap-8">
                <BoxScoreTable teamName={game.homeTeamName} stats={homeStats} />
                <BoxScoreTable teamName={game.awayTeamName} stats={awayStats} />
            </div>
        </div>
    );
};

const BoxScoreTable = ({ teamName, stats }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800">{teamName} Box Score</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase">Player</th>
                        <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase">MIN</th>
                        <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase">PTS</th>
                        <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase">REB</th>
                        <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase">AST</th>
                        <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase">STL</th>
                        <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase">BLK</th>
                        <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase">TO</th>
                        <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase">PF</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {stats.map((stat) => (
                        <tr key={stat.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">
                                <Link to={`/players/${stat.playerId}`} className="hover:text-blue-600">
                                    {stat.playerName}
                                </Link>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-slate-600">{stat.minutes}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-center font-bold text-slate-900">{stat.points}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-slate-600">{stat.rebounds}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-slate-600">{stat.assists}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-slate-600">{stat.steals}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-slate-600">{stat.blocks}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-slate-600">{stat.turnovers}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-slate-600">{stat.personalFouls || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default GameDetail;
