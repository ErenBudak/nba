package com.nba.nba.dto;

import lombok.Data;

@Data
public class StandingsDTO {
  private Integer teamId;
  private String teamName;
  private String teamAbbreviation;
  private Integer wins;
  private Integer losses;
  private Double winPercentage;
  private String conference;
}
