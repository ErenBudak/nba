package com.nba.nba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nba.nba.entity.Game;

// lazy loadingi engellemek için tek seferde tüm ilişkili verileri yükler

public interface GameRepository extends JpaRepository<Game, Integer> {
        @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "homeTeam", "homeTeam.division",
                        "homeTeam.division.conference", "awayTeam", "awayTeam.division", "awayTeam.division.conference",
                        "season" })
        java.util.List<Game> findBySeasonId(Integer seasonId);

        @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "homeTeam", "homeTeam.division",
                        "homeTeam.division.conference", "awayTeam", "awayTeam.division", "awayTeam.division.conference",
                        "season" })
        java.util.List<Game> findAll();

        @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "homeTeam", "homeTeam.division",
                        "homeTeam.division.conference", "awayTeam", "awayTeam.division", "awayTeam.division.conference",
                        "season" })
        java.util.Optional<Game> findById(Integer id);

        @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "homeTeam", "season" })
        java.util.List<Game> findTop10ByOrderByDateDesc();

        java.util.List<Game> findBySeasonIdAndHomeTeamIdOrSeasonIdAndAwayTeamId(Integer seasonId1, Integer homeTeamId,
                        Integer seasonId2, Integer awayTeamId);

        java.util.List<Game> findByHomeTeamIdOrAwayTeamId(Integer homeTeamId, Integer awayTeamId);
}
