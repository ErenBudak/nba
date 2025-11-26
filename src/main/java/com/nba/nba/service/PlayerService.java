package com.nba.nba.service;

import com.nba.nba.dto.PlayerStatsDTO;
import com.nba.nba.entity.Player;
import com.nba.nba.entity.Stats;
import com.nba.nba.repository.PlayerRepository;
import com.nba.nba.repository.StatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

  @Autowired
  private PlayerRepository playerRepository;

  @Autowired
  private StatsService statsService;

  @Autowired
  private StatsRepository statsRepository;

  public List<Player> getAllPlayers() {
    return playerRepository.findAll();
  }

  public Optional<Player> getPlayerById(Integer id) {
    return playerRepository.findById(id);
  }

  public PlayerStatsDTO getSeasonStats(Integer playerId, Integer seasonId) {
    return statsService.calculateSeasonStats(playerId, seasonId);
  }

  public List<Stats> getGameLog(Integer playerId, Integer seasonId) {
    return statsRepository.findByPlayerIdAndSeasonId(playerId, seasonId);
  }

  public Player savePlayer(Player player) {
    return playerRepository.save(player);
  }

  public void deletePlayer(Integer id) {
    playerRepository.deleteById(id);
  }
}
