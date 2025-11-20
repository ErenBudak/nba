package com.nba.nba.service;

import com.nba.nba.entity.Roster;
import com.nba.nba.entity.Team;
import com.nba.nba.repository.RosterRepository;
import com.nba.nba.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

  @Autowired
  private TeamRepository teamRepository;

  @Autowired
  private RosterRepository rosterRepository;

  public List<Team> getAllTeams() {
    return teamRepository.findAll();
  }

  public Optional<Team> getTeamById(Integer id) {
    return teamRepository.findById(id);
  }

  public List<Roster> getRoster(Integer teamId, Integer seasonId) {
    return rosterRepository.findByTeamIdAndSeasonId(teamId, seasonId);
  }
}
