package com.nba.nba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nba.nba.entity.Stats;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface StatsRepository extends JpaRepository<Stats, Integer> {
  @Query("SELECT s FROM Stats s JOIN s.game g WHERE s.player.id = :playerId AND g.season.id = :seasonId")
  List<Stats> findByPlayerIdAndSeasonId(Integer playerId, Integer seasonId);

  List<Stats> findByGameId(Integer gameId);
}
