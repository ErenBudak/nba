import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [homeTeamStats, setHomeTeamStats] = useState([]);
  const [awayTeamStats, setAwayTeamStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8080/api/games/${id}`),
      axios.get(`http://localhost:8080/api/stats?gameId=${id}`)
    ])
      .then(([gameRes, statsRes]) => {
        const gameData = gameRes.data;
        const statsData = statsRes.data;

        setGame(gameData);
        const homeTeamId = gameData.homeTeamId;
        const awayTeamId = gameData.awayTeamId;

        setHomeTeamStats(statsData.filter(s => s.teamId === homeTeamId));
        setAwayTeamStats(statsData.filter(s => s.teamId === awayTeamId));

        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
    <div className="container">
      <Link to="/games">← Geri Dön</Link>
      <h2>
        {game?.homeTeamName} {game?.homeScore} - {game?.awayScore} {game?.awayTeamName}
      </h2>

      <h3>{game?.homeTeamName}</h3>
      <table className="stats-table">
        <thead>
          <tr>
            <th>Oyuncu</th>
            <th>Puan</th>
            <th>Ribaund</th>
            <th>Asist</th>
          </tr>
        </thead>
        <tbody>
          {homeTeamStats.map((stat, idx) => (
            <tr key={idx}>
              <td>{stat.playerName}</td>
              <td>{stat.points}</td>
              <td>{stat.rebounds}</td>
              <td>{stat.assists}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>{game?.awayTeamName}</h3>
      <table className="stats-table">
        <thead>
          <tr>
            <th>Oyuncu</th>
            <th>Puan</th>
            <th>Ribaund</th>
            <th>Asist</th>
          </tr>
        </thead>
        <tbody>
          {awayTeamStats.map((stat, idx) => (
            <tr key={idx}>
              <td>{stat.playerName}</td>
              <td>{stat.points}</td>
              <td>{stat.rebounds}</td>
              <td>{stat.assists}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameDetail;
