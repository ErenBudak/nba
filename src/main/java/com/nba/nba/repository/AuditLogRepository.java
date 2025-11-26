package com.nba.nba.repository;

import com.nba.nba.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Integer> {
  List<AuditLog> findByUserId(Integer userId);
}
