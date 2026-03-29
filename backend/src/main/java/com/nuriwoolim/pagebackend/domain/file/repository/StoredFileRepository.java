package com.nuriwoolim.pagebackend.domain.file.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nuriwoolim.pagebackend.domain.file.entity.StoredFile;

public interface StoredFileRepository extends JpaRepository<StoredFile, Long> {
	Optional<StoredFile> findByStoredFileName(String storedFileName);
}

