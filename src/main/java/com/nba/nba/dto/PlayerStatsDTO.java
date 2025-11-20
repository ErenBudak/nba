package com.nba.nba.dto;

import lombok.Data;

@Data
public class PlayerStatsDTO {
  private Integer seasonId;
  private String seasonName;
  private Integer teamId;
  private String teamAbbreviation;
  private Integer gamesPlayed;
  private Double minutesPerGame;
  private Double pointsPerGame;
  private Double reboundsPerGame;
  private Double assistsPerGame;
  private Double stealsPerGame;
  private Double blocksPerGame;
  private Double fieldGoalPercentage;
  private Double threePointPercentage;
  private Double freeThrowPercentage;
}
