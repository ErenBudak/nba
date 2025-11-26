package com.nba.nba.mapper;

import com.nba.nba.entity.Conference;
import com.nba.nba.dto.ConferenceDTO;
import org.springframework.stereotype.Component;

@Component
public class ConferenceMapper {

  public ConferenceDTO toDTO(Conference conference) {
    if (conference == null) {
      return null;
    }
    ConferenceDTO dto = new ConferenceDTO();
    dto.setId(conference.getId());
    dto.setConferenceName(conference.getConferenceName());
    return dto;
  }
}
