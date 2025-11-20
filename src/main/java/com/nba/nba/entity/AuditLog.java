package com.nba.nba.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "AUDIT_LOG")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "user_id", nullable = false)
  private Integer userId;

  @Column(name = "action_type", nullable = false, length = 50)
  private String actionType;

  @Column(name = "table_name", length = 50)
  private String tableName;

  @Column(name = "record_id")
  private Integer recordId;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(name = "action_time", insertable = false, updatable = false)
  private LocalDateTime actionTime;
}
