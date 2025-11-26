package com.nba.nba.mapper;

import com.nba.nba.entity.Game;
import com.nba.nba.dto.GameDTO;
import org.springframework.stereotype.Component;

@Component
public class GameMapper {

  public GameDTO toDTO(Game game) {
    if (game == null) {
      return null;
    }
    GameDTO dto = new GameDTO();
    dto.setId(game.getId());
    dto.setDate(game.getDate());
    dto.setHomeScore(game.getHomeScore());
    dto.setAwayScore(game.getAwayScore());
    dto.setGameType(game.getGameType());

    if (game.getHomeTeam() != null) {
      dto.setHomeTeamId(game.getHomeTeam().getId());
      dto.setHomeTeamName(game.getHomeTeam().getName());
    }
    if (game.getAwayTeam() != null) {
      dto.setAwayTeamId(game.getAwayTeam().getId());
      dto.setAwayTeamName(game.getAwayTeam().getName());
    }
    if (game.getSeason() != null) {
      dto.setSeasonId(game.getSeason().getId());
      dto.setSeasonName(game.getSeason().getName());
    }
    return dto;
  }
}
