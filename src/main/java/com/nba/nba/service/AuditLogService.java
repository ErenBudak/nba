package com.nba.nba.service;

import com.nba.nba.entity.AuditLog;
import com.nba.nba.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {

  private final AuditLogRepository auditLogRepository;

  public AuditLogService(AuditLogRepository auditLogRepository) {
    this.auditLogRepository = auditLogRepository;
  }

  @Transactional
  public void logAction(Integer userId, String actionType, String tableName, Integer recordId, String description) {
    AuditLog log = new AuditLog();
    log.setUserId(userId);
    log.setActionType(actionType);
    log.setTableName(tableName);
    log.setRecordId(recordId);
    log.setDescription(description);
    auditLogRepository.save(log);
  }
}
