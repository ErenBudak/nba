package com.nba.nba.mapper;

import com.nba.nba.entity.Season;
import com.nba.nba.dto.SeasonDTO;
import org.springframework.stereotype.Component;

@Component
public class SeasonMapper {

  public SeasonDTO toDTO(Season season) {
    if (season == null) {
      return null;
    }
    SeasonDTO dto = new SeasonDTO();
    dto.setId(season.getId());
    dto.setName(season.getName());
    return dto;
  }
}
