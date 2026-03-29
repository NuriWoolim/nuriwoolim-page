package com.nuriwoolim.pagebackend.global.storage.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nuriwoolim.pagebackend.global.storage.entity.OrphanFileLog;
import com.nuriwoolim.pagebackend.global.storage.entity.OrphanFileStatus;

public interface OrphanFileLogRepository extends JpaRepository<OrphanFileLog, Long> {
	List<OrphanFileLog> findByStatus(OrphanFileStatus status);
}

