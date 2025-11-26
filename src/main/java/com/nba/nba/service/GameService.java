package com.nba.nba.service;

import com.nba.nba.dto.StandingsDTO;
import com.nba.nba.entity.Game;
import com.nba.nba.entity.Team;
import com.nba.nba.repository.GameRepository;
import com.nba.nba.repository.TeamRepository;
import com.nba.nba.repository.SeasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.nba.nba.mapper.GameMapper;
import com.nba.nba.mapper.SeasonMapper;
import com.nba.nba.dto.GameDTO;
import com.nba.nba.dto.SeasonDTO;
import com.nba.nba.dto.CreateGameDTO;
import com.nba.nba.entity.Season;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

  @Autowired
  private GameRepository gameRepository;

  @Autowired
  private TeamRepository teamRepository;

  @Autowired
  private SeasonRepository seasonRepository;

  @Autowired
  private GameMapper gameMapper;

  @Autowired
  private SeasonMapper seasonMapper;

  public List<GameDTO> getRecentGames() {
    return gameRepository.findTop10ByOrderByDateDesc().stream()
        .map(gameMapper::toDTO)
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
      if (team.getDivision() != null && team.getDivision().getConference() != null) {
        dto.setConference(team.getDivision().getConference().getConferenceName());
      }
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
        continue;

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

  public Optional<GameDTO> getGameById(Integer id) {
    return gameRepository.findById(id).map(gameMapper::toDTO);
  }

  public List<GameDTO> getTeamGames(Integer teamId) {
    return gameRepository.findAll().stream()
        .filter(g -> g.getHomeTeam().getId().equals(teamId) || g.getAwayTeam().getId().equals(teamId))
        .sorted(Comparator.comparing(Game::getDate))
        .map(gameMapper::toDTO)
        .collect(Collectors.toList());
  }

  public List<GameDTO> getAllGames(Integer seasonId, Integer teamId) {
    List<Game> games;
    if (seasonId != null && teamId != null) {
      games = gameRepository.findBySeasonIdAndHomeTeamIdOrSeasonIdAndAwayTeamId(seasonId, teamId, seasonId, teamId);
    } else if (seasonId != null) {
      games = gameRepository.findBySeasonId(seasonId);
    } else if (teamId != null) {
      games = gameRepository.findByHomeTeamIdOrAwayTeamId(teamId, teamId);
    } else {
      games = gameRepository.findAll();
    }

    return games.stream()
        .sorted(Comparator.comparing(Game::getDate).reversed())
        .map(gameMapper::toDTO)
        .collect(Collectors.toList());
  }

  public List<SeasonDTO> getAllSeasons() {
    return seasonRepository.findAll().stream()
        .map(seasonMapper::toDTO)
        .collect(Collectors.toList());
  }

  public GameDTO createGame(CreateGameDTO dto) {
    Game game = new Game();
    game.setDate(dto.getDate());
    game.setGameType(dto.getGameType());

    Team homeTeam = teamRepository.findById(dto.getHomeTeamId())
        .orElseThrow(() -> new RuntimeException("Home team not found"));
    Team awayTeam = teamRepository.findById(dto.getAwayTeamId())
        .orElseThrow(() -> new RuntimeException("Away team not found"));
    Season season = seasonRepository.findById(dto.getSeasonId())
        .orElseThrow(() -> new RuntimeException("Season not found"));

    game.setHomeTeam(homeTeam);
    game.setAwayTeam(awayTeam);
    game.setSeason(season);
    game.setHomeScore(dto.getHomeScore());
    game.setAwayScore(dto.getAwayScore());

    Game savedGame = gameRepository.save(game);
    return gameMapper.toDTO(savedGame);
  }

  public void deleteGame(Integer id) {
    gameRepository.deleteById(id);
  }
}
