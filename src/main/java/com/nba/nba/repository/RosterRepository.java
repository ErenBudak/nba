package com.nba.nba.repository;

import com.nba.nba.entity.Roster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RosterRepository extends JpaRepository<Roster, Integer> {
  List<Roster> findByTeamIdAndSeasonId(Integer teamId, Integer seasonId);

  List<Roster> findByPlayerId(Integer playerId);
}
