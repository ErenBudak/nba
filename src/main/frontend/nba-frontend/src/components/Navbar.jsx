import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path 
            ? 'bg-slate-800 text-white' 
            : 'text-slate-300 hover:bg-slate-800 hover:text-white';
    };

    return (
        <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo & Brand */}
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                N
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">NBA Stats</span>
                        </Link>
                        
                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-1">
                            <Link 
                                to="/" 
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/')}`}
                            >
                                Dashboard
                            </Link>
                            <Link 
                                to="/players" 
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/players')}`}
                            >
                                Players
                            </Link>
                            <Link 
                                to="/teams" 
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/teams')}`}
                            >
                                Teams
                            </Link>
                        </div>
                    </div>

                    {/* Right Side: Search & Login */}
                    <div className="flex items-center space-x-4">
                        <div className="relative hidden md:block">
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="bg-slate-800 text-sm text-white rounded-full pl-10 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 transition-all focus:w-64"
                            />
                            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Log In
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
