package com.nba.nba.service;

import com.nba.nba.entity.Roster;
import com.nba.nba.entity.Team;
import com.nba.nba.repository.RosterRepository;
import com.nba.nba.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import com.nba.nba.dto.TeamDTO;
import com.nba.nba.mapper.TeamMapper;
import com.nba.nba.dto.CreateTeamDTO;
import com.nba.nba.entity.Division;
import com.nba.nba.repository.DivisionRepository;
import com.nba.nba.mapper.DivisionMapper;
import com.nba.nba.dto.DivisionDTO;
import com.nba.nba.repository.SeasonRepository;
import com.nba.nba.entity.Season;

@Service
public class TeamService {

  @Autowired
  private TeamRepository teamRepository;

  @Autowired
  private RosterRepository rosterRepository;

  @Autowired
  private TeamMapper teamMapper;

  @Autowired
  private SeasonRepository seasonRepository;

  public List<TeamDTO> getAllTeams() {
    return teamRepository.findAll().stream()
        .map(teamMapper::toDTO)
        .collect(java.util.stream.Collectors.toList());
  }

  public Optional<TeamDTO> getTeamById(Integer id) {
    return teamRepository.findById(id).map(teamMapper::toDTO);
  }

  public List<Roster> getRoster(Integer teamId, Integer seasonId) {
    if (seasonId == null) {
      Season latestSeason = seasonRepository.findTopByOrderByIdDesc()
          .orElseThrow(() -> new RuntimeException("No seasons found"));
      seasonId = latestSeason.getId();
    }
    return rosterRepository.findByTeamIdAndSeasonId(teamId, seasonId);
  }

  public TeamDTO saveTeam(Team team) {
    Team savedTeam = teamRepository.save(team);
    return teamMapper.toDTO(savedTeam);
  }

  public TeamDTO createTeam(CreateTeamDTO dto) {
    Division division = divisionRepository.findById(dto.getDivisionId())
        .orElseThrow(() -> new RuntimeException("Division not found"));

    Team team = new Team();
    team.setName(dto.getName());
    team.setAbbreviation(dto.getAbbreviation());
    team.setCity(dto.getCity());
    team.setDivision(division);

    Team savedTeam = teamRepository.save(team);
    return teamMapper.toDTO(savedTeam);
  }

  public void deleteTeam(Integer id) {
    teamRepository.deleteById(id);
  }

  @Autowired
  private DivisionRepository divisionRepository;

  @Autowired
  private DivisionMapper divisionMapper;

  public List<DivisionDTO> getAllDivisions() {
    return divisionRepository.findAll().stream()
        .map(divisionMapper::toDTO)
        .collect(java.util.stream.Collectors.toList());
  }
}
