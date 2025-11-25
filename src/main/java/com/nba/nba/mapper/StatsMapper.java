package com.nba.nba.mapper;

import com.nba.nba.config.entity.Stats;
import com.nba.nba.dto.StatsDTO;
import org.springframework.stereotype.Component;

@Component
public class StatsMapper {

  public StatsDTO toDTO(Stats stats) {
    if (stats == null) {
      return null;
    }
    StatsDTO dto = new StatsDTO();
    dto.setId(stats.getId());
    dto.setMinutes(stats.getMinutesPlayed());
    dto.setPoints(stats.getPoints());
    dto.setRebounds(stats.getRebounds());
    dto.setAssists(stats.getAssists());
    dto.setSteals(stats.getSteals());
    dto.setBlocks(stats.getBlocks());
    dto.setTurnovers(stats.getTurnovers());

    if (stats.getGame() != null) {
      dto.setGameId(stats.getGame().getId());
      dto.setGameDate(stats.getGame().getDate().toString());
      if (stats.getGame().getHomeTeam() != null) {
        dto.setHomeTeamId(stats.getGame().getHomeTeam().getId());
        dto.setHomeTeamAbbreviation(stats.getGame().getHomeTeam().getAbbreviation());
      }
      if (stats.getGame().getAwayTeam() != null) {
        dto.setAwayTeamId(stats.getGame().getAwayTeam().getId());
        dto.setAwayTeamAbbreviation(stats.getGame().getAwayTeam().getAbbreviation());
      }
    }
    if (stats.getTeam() != null) {
      dto.setTeamId(stats.getTeam().getId());
    }
    if (stats.getPlayer() != null) {
      dto.setPlayerId(stats.getPlayer().getId());
      dto.setPlayerName(stats.getPlayer().getPlayerName() + " " + stats.getPlayer().getPlayerSurname());
    }
    return dto;
  }
}
