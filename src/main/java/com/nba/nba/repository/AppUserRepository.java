package com.nba.nba.repository;

import com.nba.nba.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Integer> {
  Optional<AppUser> findByUsername(String username);

  Optional<AppUser> findByEmail(String email);
}
