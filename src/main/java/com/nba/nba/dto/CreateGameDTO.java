package com.nba.nba.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateGameDTO {
  private LocalDate date;
  private Integer homeTeamId;
  private Integer awayTeamId;
  private Integer seasonId;
  private String gameType; // e.g., "Regular Season", "Playoff"
}
