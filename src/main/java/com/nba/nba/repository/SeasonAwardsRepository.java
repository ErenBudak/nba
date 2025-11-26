package com.nba.nba.repository;

import com.nba.nba.entity.SeasonAwards;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeasonAwardsRepository extends JpaRepository<SeasonAwards, Integer> {
  List<SeasonAwards> findBySeasonId(Integer seasonId);

  List<SeasonAwards> findByPlayerId(Integer playerId);
}
