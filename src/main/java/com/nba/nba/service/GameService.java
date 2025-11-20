package com.nba.nba.service;

import com.nba.nba.dto.StandingsDTO;
import com.nba.nba.entity.Game;
import com.nba.nba.entity.Team;
import com.nba.nba.repository.GameRepository;
import com.nba.nba.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

  @Autowired
  private GameRepository gameRepository;

  @Autowired
  private TeamRepository teamRepository;

  public List<Game> getRecentGames() {
    // Assuming we want the last 5 games.
    // Since we don't have a custom query for "last 5", we can fetch all and limit,
    // or add a custom query. For now, let's fetch all and sort in memory (not
    // efficient for large DBs but ok for MVP).
    // Better: Add findTop5ByOrderByDateDesc to Repository.
    return gameRepository.findAll().stream()
        .sorted(Comparator.comparing(Game::getDate).reversed())
        .limit(5)
        .collect(Collectors.toList());
  }

  public List<StandingsDTO> getStandings(Integer seasonId) {
    List<Game> games = gameRepository.findAll().stream()
        .filter(g -> g.getSeason().getId().equals(seasonId))
        .collect(Collectors.toList());

    Map<Integer, StandingsDTO> standingsMap = new HashMap<>();
    List<Team> teams = teamRepository.findAll();

    for (Team team : teams) {
      StandingsDTO dto = new StandingsDTO();
      dto.setTeamId(team.getId());
      dto.setTeamName(team.getName());
      dto.setTeamAbbreviation(team.getAbbreviation());
      dto.setConference(team.getDivision().getConference().getConferenceName());
      dto.setWins(0);
      dto.setLosses(0);
      standingsMap.put(team.getId(), dto);
    }

    for (Game game : games) {
      if (game.getHomeScore() == null || game.getAwayScore() == null)
        continue;

      StandingsDTO homeDto = standingsMap.get(game.getHomeTeam().getId());
      StandingsDTO awayDto = standingsMap.get(game.getAwayTeam().getId());

      if (homeDto == null || awayDto == null)
        continue; // Should not happen

      if (game.getHomeScore() > game.getAwayScore()) {
        homeDto.setWins(homeDto.getWins() + 1);
        awayDto.setLosses(awayDto.getLosses() + 1);
      } else {
        awayDto.setWins(awayDto.getWins() + 1);
        homeDto.setLosses(homeDto.getLosses() + 1);
      }
    }

    return standingsMap.values().stream()
        .peek(dto -> {
          int total = dto.getWins() + dto.getLosses();
          dto.setWinPercentage(total > 0 ? (double) dto.getWins() / total : 0.0);
        })
        .sorted(Comparator.comparing(StandingsDTO::getWinPercentage).reversed())
        .collect(Collectors.toList());
  }

  public Optional<Game> getGameById(Integer id) {
    return gameRepository.findById(id);
  }

  public List<Game> getTeamGames(Integer teamId) {
    return gameRepository.findAll().stream()
        .filter(g -> g.getHomeTeam().getId().equals(teamId) || g.getAwayTeam().getId().equals(teamId))
        .sorted(Comparator.comparing(Game::getDate))
        .collect(Collectors.toList());
  }
}
