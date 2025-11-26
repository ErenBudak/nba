package com.nba.nba.mapper;

import com.nba.nba.entity.Division;
import com.nba.nba.dto.DivisionDTO;
import org.springframework.stereotype.Component;

@Component
public class DivisionMapper {

  public DivisionDTO toDTO(Division division) {
    if (division == null) {
      return null;
    }
    DivisionDTO dto = new DivisionDTO();
    dto.setId(division.getId());
    dto.setName(division.getName());
    if (division.getConference() != null) {
      dto.setConferenceId(division.getConference().getId());
      dto.setConferenceName(division.getConference().getConferenceName());
    }
    return dto;
  }
}
