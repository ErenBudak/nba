package com.nba.nba.repository;

import com.nba.nba.entity.Roster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RosterRepository extends JpaRepository<Roster, Integer> {
  @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "player", "team", "season" })
  List<Roster> findByTeamIdAndSeasonId(Integer teamId, Integer seasonId);

  @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "player", "team", "season" })
  List<Roster> findByPlayerId(Integer playerId);

  boolean existsByPlayerIdAndTeamIdAndSeasonId(Integer playerId, Integer teamId, Integer seasonId);
}
