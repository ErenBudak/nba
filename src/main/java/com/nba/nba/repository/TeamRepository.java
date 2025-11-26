package com.nba.nba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nba.nba.entity.Team;

public interface TeamRepository extends JpaRepository<Team, Integer> {
  @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "division", "division.conference" })
  java.util.List<Team> findAll();

  @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "division", "division.conference" })
  java.util.Optional<Team> findById(Integer id);
}
