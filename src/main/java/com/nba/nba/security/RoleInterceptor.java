package com.nba.nba.security;

import com.nba.nba.entity.AppUser;
import com.nba.nba.repository.AppUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import java.util.Optional;

// her isteği kontrol ediyor

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
      return true;
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
