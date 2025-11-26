package com.nba.nba.service;

import com.nba.nba.dto.PlayerStatsDTO;
import com.nba.nba.entity.Stats;
import com.nba.nba.repository.StatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import com.nba.nba.repository.PlayerRepository;
import com.nba.nba.repository.GameRepository;
import com.nba.nba.repository.TeamRepository;
import com.nba.nba.dto.CreateStatsDTO;
import com.nba.nba.entity.Player;
import com.nba.nba.entity.Game;
import com.nba.nba.entity.Team;

@Service
public class StatsService {

  @Autowired
  private StatsRepository statsRepository;

  @Autowired
  private com.nba.nba.repository.RosterRepository rosterRepository;

  public PlayerStatsDTO calculateSeasonStats(Integer playerId, Integer seasonId) {
    List<Stats> statsList = statsRepository.findByPlayerIdAndSeasonId(playerId, seasonId);
    if (statsList.isEmpty()) {
      return null;
    }

    PlayerStatsDTO dto = new PlayerStatsDTO();
    dto.setSeasonId(seasonId);
    // Assuming all stats belong to the same team for a season for simplicity,
    // or we pick the last one. Ideally we'd handle multi-team seasons.
    // For now, let's just take the team from the first stat entry.
    dto.setTeamId(statsList.get(0).getTeam().getId());
    dto.setTeamAbbreviation(statsList.get(0).getTeam().getAbbreviation());

    int gamesPlayed = statsList.size();
    dto.setGamesPlayed(gamesPlayed);

    double totalMinutes = 0;
    int totalPoints = 0;
    int totalRebounds = 0;
    int totalAssists = 0;
    int totalSteals = 0;
    int totalBlocks = 0;
    int totalFGM = 0;
    int totalFGA = 0;
    int total3PM = 0;
    int total3PA = 0;
    int totalFTM = 0;
    int totalFTA = 0;

    for (Stats s : statsList) {
      totalMinutes += s.getMinutesPlayed() != null ? s.getMinutesPlayed() : 0;
      totalPoints += s.getPoints() != null ? s.getPoints() : 0;
      totalRebounds += s.getRebounds() != null ? s.getRebounds() : 0;
      totalAssists += s.getAssists() != null ? s.getAssists() : 0;
      totalSteals += s.getSteals() != null ? s.getSteals() : 0;
      totalBlocks += s.getBlocks() != null ? s.getBlocks() : 0;
      totalFGM += s.getFieldGoalsMade() != null ? s.getFieldGoalsMade() : 0;
      totalFGA += s.getFieldGoalsAttempted() != null ? s.getFieldGoalsAttempted() : 0;
      total3PM += s.getThreePointersMade() != null ? s.getThreePointersMade() : 0;
      total3PA += s.getThreePointersAttempted() != null ? s.getThreePointersAttempted() : 0;
      totalFTM += s.getFreeThrowsMade() != null ? s.getFreeThrowsMade() : 0;
      totalFTA += s.getFreeThrowsAttempted() != null ? s.getFreeThrowsAttempted() : 0;
    }

    dto.setMinutesPerGame(gamesPlayed > 0 ? totalMinutes / gamesPlayed : 0);
    dto.setPointsPerGame(gamesPlayed > 0 ? (double) totalPoints / gamesPlayed : 0);
    dto.setReboundsPerGame(gamesPlayed > 0 ? (double) totalRebounds / gamesPlayed : 0);
    dto.setAssistsPerGame(gamesPlayed > 0 ? (double) totalAssists / gamesPlayed : 0);
    dto.setStealsPerGame(gamesPlayed > 0 ? (double) totalSteals / gamesPlayed : 0);
    dto.setBlocksPerGame(gamesPlayed > 0 ? (double) totalBlocks / gamesPlayed : 0);

    dto.setFieldGoalPercentage(totalFGA > 0 ? (double) totalFGM / totalFGA : 0);
    dto.setThreePointPercentage(total3PA > 0 ? (double) total3PM / total3PA : 0);
    dto.setFreeThrowPercentage(totalFTA > 0 ? (double) totalFTM / totalFTA : 0);

    return dto;
  }

  @Autowired
  private PlayerRepository playerRepository;
  @Autowired
  private GameRepository gameRepository;
  @Autowired
  private TeamRepository teamRepository;

  public Stats createStats(CreateStatsDTO dto) {
    Player player = playerRepository.findById(dto.getPlayerId())
        .orElseThrow(() -> new RuntimeException("Player not found"));
    Game game = gameRepository.findById(dto.getGameId())
        .orElseThrow(() -> new RuntimeException("Game not found"));
    Team team = teamRepository.findById(dto.getTeamId())
        .orElseThrow(() -> new RuntimeException("Team not found"));

    // Validate that the team is either home or away team
    if (!team.getId().equals(game.getHomeTeam().getId()) && !team.getId().equals(game.getAwayTeam().getId())) {
      throw new RuntimeException("Selected team is not part of this game");
    }

    // Validate that the player is in the roster of the selected team for the game's
    // season
    boolean isPlayerInRoster = rosterRepository.existsByPlayerIdAndTeamIdAndSeasonId(
        player.getId(), team.getId(), game.getSeason().getId());

    if (!isPlayerInRoster) {
      throw new RuntimeException("Selected player is not in the roster of either team for this game's season.");
    }

    Stats stats = new Stats();
    stats.setPlayer(player);
    stats.setGame(game);
    stats.setTeam(team);
    stats.setMinutesPlayed(dto.getMinutesPlayed());
    stats.setPoints(dto.getPoints());
    stats.setRebounds(dto.getRebounds());
    stats.setAssists(dto.getAssists());
    stats.setSteals(dto.getSteals());
    stats.setBlocks(dto.getBlocks());
    stats.setTurnovers(dto.getTurnovers());
    stats.setFieldGoalsMade(dto.getFieldGoalsMade());
    stats.setFieldGoalsAttempted(dto.getFieldGoalsAttempted());
    stats.setThreePointersMade(dto.getThreePointersMade());
    stats.setThreePointersAttempted(dto.getThreePointersAttempted());
    stats.setFreeThrowsMade(dto.getFreeThrowsMade());
    stats.setFreeThrowsAttempted(dto.getFreeThrowsAttempted());
    stats.setPersonalFouls(dto.getPersonalFouls());

    return statsRepository.save(stats);
  }
}
