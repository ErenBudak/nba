package com.nba.nba.security;

import com.nba.nba.entity.AppUser;
import com.nba.nba.repository.AppUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Optional;

@Component
public class RoleInterceptor implements HandlerInterceptor {

  private final AppUserRepository appUserRepository;

  public RoleInterceptor(AppUserRepository appUserRepository) {
    this.appUserRepository = appUserRepository;
  }

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    if (!(handler instanceof HandlerMethod)) {
      return true;
    }

    HandlerMethod handlerMethod = (HandlerMethod) handler;
    RequireRole requireRole = handlerMethod.getMethodAnnotation(RequireRole.class);

    if (requireRole == null) {
      return true; // No role required
    }

    String userIdStr = request.getHeader("X-User-Id");
    if (userIdStr == null) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.getWriter().write("Missing X-User-Id header");
      return false;
    }

    Integer userId;
    try {
      userId = Integer.parseInt(userIdStr);
    } catch (NumberFormatException e) {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      response.getWriter().write("Invalid X-User-Id header");
      return false;
    }

    Optional<AppUser> userOpt = appUserRepository.findById(userId);
    if (userOpt.isEmpty()) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.getWriter().write("User not found");
      return false;
    }

    AppUser user = userOpt.get();
    String requiredRole = requireRole.value();

    // Simple role check: ADMIN can access everything? Or strict check?
    // Requirement: "Sadece 'ADMIN' rolüne sahip olanlar veri girişi yapabilsin."
    // So if required is ADMIN, user must be ADMIN.
    // If required is USER, ADMIN should probably also be able to access, or just
    // USER.
    // Let's assume ADMIN has all privileges, so if user is ADMIN, they pass.
    // If user is USER, they only pass if requiredRole is USER.

    if ("ADMIN".equals(user.getRole())) {
      return true; // Admin passes all checks
    }

    if (!requiredRole.equals(user.getRole())) {
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
      response.getWriter().write("Insufficient permissions");
      return false;
    }

    return true;
  }
}
