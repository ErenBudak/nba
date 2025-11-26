package com.nba.nba.controller;

import com.nba.nba.dto.CreateRosterDTO;
import com.nba.nba.entity.Roster;
import com.nba.nba.service.RosterService;
import com.nba.nba.service.AuditLogService;
import com.nba.nba.security.RequireRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// kadro ile ilgili işlemler için controller

@RestController
@RequestMapping("/api/roster")
public class RosterController {

  @Autowired
  private RosterService rosterService;

  @Autowired
  private AuditLogService auditLogService;

  @PostMapping
  @RequireRole("ADMIN")
  public ResponseEntity<Roster> createRoster(@RequestBody CreateRosterDTO dto,
      jakarta.servlet.http.HttpServletRequest request) {
    Roster savedRoster = rosterService.createRoster(dto);

    Integer userId = Integer.parseInt(request.getHeader("X-User-Id"));
    auditLogService.logAction(userId, "INSERT_ROSTER", "ROSTER", savedRoster.getId(),
        "Added player " + savedRoster.getPlayer().getId() + " to team " + savedRoster.getTeam().getId());

    return ResponseEntity.ok(savedRoster);
  }
}
