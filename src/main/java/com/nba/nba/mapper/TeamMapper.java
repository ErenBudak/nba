package com.nba.nba.mapper;

import com.nba.nba.entity.Team;
import com.nba.nba.dto.TeamDTO;
import org.springframework.stereotype.Component;

@Component
public class TeamMapper {

  public TeamDTO toDTO(Team team) {
    if (team == null) {
      return null;
    }

    TeamDTO dto = new TeamDTO();
    dto.setId(team.getId());
    dto.setName(team.getName());
    dto.setAbbreviation(team.getAbbreviation());
    dto.setCity(team.getCity());

    if (team.getDivision() != null) {
      dto.setDivisionId(team.getDivision().getId());
      dto.setDivisionName(team.getDivision().getName());
    }

    return dto;
  }
}
