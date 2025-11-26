package com.nba.nba.controller;

import com.nba.nba.entity.AppUser;
import com.nba.nba.entity.UserFavoritePlayer;
import com.nba.nba.entity.UserFavoriteTeam;
import com.nba.nba.repository.AppUserRepository;
import com.nba.nba.repository.UserFavoritePlayerRepository;
import com.nba.nba.repository.UserFavoriteTeamRepository;
import com.nba.nba.security.RequireRole;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Optional;

// kullanıcı ile ilgili işlemler için controller

@RestController
@RequestMapping("/api/my-profile")
public class UserController {

  private final AppUserRepository appUserRepository;
  private final UserFavoriteTeamRepository favoriteTeamRepository;
  private final UserFavoritePlayerRepository favoritePlayerRepository;

  public UserController(AppUserRepository appUserRepository,
      UserFavoriteTeamRepository favoriteTeamRepository,
      UserFavoritePlayerRepository favoritePlayerRepository) {
    this.appUserRepository = appUserRepository;
    this.favoriteTeamRepository = favoriteTeamRepository;
    this.favoritePlayerRepository = favoritePlayerRepository;
  }

  @GetMapping
  @RequireRole("USER")
  public ResponseEntity<?> getMyProfile(HttpServletRequest request) {
    Integer userId = Integer.parseInt(request.getHeader("X-User-Id"));

    Optional<AppUser> userOpt = appUserRepository.findById(userId);
    if (userOpt.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    AppUser user = userOpt.get();
    List<UserFavoriteTeam> favoriteTeams = favoriteTeamRepository.findByUserId(userId);
    List<UserFavoritePlayer> favoritePlayers = favoritePlayerRepository.findByUserId(userId);

    UserProfileDTO profile = new UserProfileDTO();
    profile.setUsername(user.getUsername());
    profile.setEmail(user.getEmail());
    profile.setRole(user.getRole());
    profile.setFavoriteTeams(favoriteTeams);
    profile.setFavoritePlayers(favoritePlayers);

    return ResponseEntity.ok(profile);
  }

  @Data
  static class UserProfileDTO {
    private String username;
    private String email;
    private String role;
    private List<UserFavoriteTeam> favoriteTeams;
    private List<UserFavoritePlayer> favoritePlayers;
  }
}
