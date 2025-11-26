package com.nba.nba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nba.nba.entity.Stats;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface StatsRepository extends JpaRepository<Stats, Integer> {
  @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "player", "game", "game.homeTeam",
      "game.awayTeam", "game.season" })
  @Query("SELECT s FROM Stats s JOIN s.game g WHERE s.player.id = :playerId AND g.season.id = :seasonId")
  List<Stats> findByPlayerIdAndSeasonId(Integer playerId, Integer seasonId);

  @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "player", "game", "game.homeTeam",
      "game.awayTeam", "game.season", "team" })
  List<Stats> findByGameId(Integer gameId);
}
