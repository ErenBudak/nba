import React, { useEffect, useState } from 'react';
import { getAllTeams } from '../services/api';
import { Link } from 'react-router-dom';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllTeams();
                setTeams(response.data);
            } catch (error) {
                console.error("Error fetching teams:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen text-slate-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8 border-b border-slate-200 pb-4">
                <h1 className="text-3xl font-bold text-slate-900">NBA Teams</h1>
                <p className="text-slate-500 mt-1">Select a team to view roster and schedule</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {teams.map((team) => (
                    <Link key={team.id} to={`/teams/${team.id}`} className="block group h-full">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 p-6 h-full flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-6xl font-black text-slate-900">{team.abbreviation}</span>
                            </div>
                            
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-lg border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                                    {team.abbreviation.substring(0, 2)}
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded">
                                    {team.division?.conference?.conferenceName}
                                </span>
                            </div>

                            <div className="mt-auto relative z-10">
                                <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{team.name}</h2>
                                <p className="text-sm text-slate-500 font-medium">{team.city}</p>
                                
                                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                                    <span>{team.division?.name} Div</span>
                                    <span className="group-hover:translate-x-1 transition-transform text-blue-600 font-bold">View Team &rarr;</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Teams;
