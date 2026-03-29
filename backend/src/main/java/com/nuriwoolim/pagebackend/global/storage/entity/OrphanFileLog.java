package com.nuriwoolim.pagebackend.global.storage.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 파일 삭제 실패 시 디스크에 남아 있는 고아 파일을 추적하기 위한 로그 테이블
 */
@Getter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "tb_orphan_file_log")
public class OrphanFileLog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String storedFileName;

	@Column(nullable = false, length = 1000)
	private String reason;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	@Builder.Default
	private OrphanFileStatus status = OrphanFileStatus.PENDING;

	@Column(nullable = false, updatable = false)
	@Builder.Default
	private LocalDateTime occurredAt = LocalDateTime.now();

	private LocalDateTime resolvedAt;

	public void markResolved() {
		this.status = OrphanFileStatus.RESOLVED;
		this.resolvedAt = LocalDateTime.now();
	}
}

