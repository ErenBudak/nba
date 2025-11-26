package com.nba.nba.controller;

import com.nba.nba.entity.Roster;
import com.nba.nba.service.GameService;
import com.nba.nba.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.nba.nba.dto.TeamDTO;
import com.nba.nba.dto.GameDTO;
import com.nba.nba.service.AuditLogService;
import com.nba.nba.security.RequireRole;
import com.nba.nba.dto.CreateTeamDTO;
import com.nba.nba.dto.DivisionDTO;

// takım ile ilgili işlemler için controller

@RestController
@RequestMapping("/api/teams")
public class TeamController {

	@Autowired
	private TeamService teamService;

	@Autowired
	private GameService gameService;

	@GetMapping
	public List<TeamDTO> getAllTeams() {
		return teamService.getAllTeams();
	}

	@GetMapping("/{id}")
	public ResponseEntity<TeamDTO> getTeamById(@PathVariable Integer id) {
		return teamService.getTeamById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/{id}/roster")
	public List<Roster> getRoster(@PathVariable Integer id, @RequestParam(required = false) Integer seasonId) {
		return teamService.getRoster(id, seasonId);
	}

	@GetMapping("/{id}/games")
	public List<GameDTO> getTeamGames(@PathVariable Integer id) {
		return gameService.getTeamGames(id);
	}

	@Autowired
	private AuditLogService auditLogService;

	@PostMapping
	@RequireRole("ADMIN")
	public ResponseEntity<TeamDTO> createTeam(@RequestBody CreateTeamDTO teamDTO,
			jakarta.servlet.http.HttpServletRequest request) {
		TeamDTO savedTeam = teamService.createTeam(teamDTO);

		Integer userId = Integer.parseInt(request.getHeader("X-User-Id"));
		auditLogService.logAction(userId, "INSERT_TEAM", "TEAM", savedTeam.getId(),
				"Created team: " + savedTeam.getName());

		return ResponseEntity.ok(savedTeam);
	}

	@DeleteMapping("/{id}")
	@RequireRole("ADMIN")
	public ResponseEntity<?> deleteTeam(@PathVariable Integer id, jakarta.servlet.http.HttpServletRequest request) {
		teamService.deleteTeam(id);

		Integer userId = Integer.parseInt(request.getHeader("X-User-Id"));
		auditLogService.logAction(userId, "DELETE_TEAM", "TEAM", id, "Deleted team with ID: " + id);

		return ResponseEntity.ok().build();
	}

	@GetMapping("/divisions")
	public List<DivisionDTO> getAllDivisions() {
		return teamService.getAllDivisions();
	}
}
