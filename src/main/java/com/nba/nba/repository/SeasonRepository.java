package com.nba.nba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nba.nba.entity.Season;

public interface SeasonRepository extends JpaRepository<Season, Integer> {
  java.util.Optional<Season> findTopByOrderByIdDesc();
}
