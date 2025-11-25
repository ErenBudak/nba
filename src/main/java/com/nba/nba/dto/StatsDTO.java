package com.nba.nba.dto;

import lombok.Data;

@Data
package com.nba.nba.dto;

import lombok.Data;

@Data
public class StatsDTO {
  private Integer id;
  private Integer gameId;
  private Integer teamId;
  private Integer playerId;
  private String playerName;
  private String gameDate;
  private Integer homeTeamId;
  private String homeTeamAbbreviation;
  private Integer awayTeamId;
  private String awayTeamAbbreviation;
  private Integer points;
  private Integer assists;
  private Integer rebounds;
  private Integer steals;
  private Integer blocks;
  private Integer turnovers;
  private Float minutes;
}
