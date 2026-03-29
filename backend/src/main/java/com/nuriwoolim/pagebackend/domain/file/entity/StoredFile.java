package com.nuriwoolim.pagebackend.domain.file.entity;

import org.hibernate.annotations.SQLRestriction;

import com.nuriwoolim.pagebackend.core.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@SQLRestriction("deleted = false")
@Table(name = "stored_file")
public class StoredFile extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String originalFileName;

	@Column(nullable = false, unique = true)
	private String storedFileName;

	@Column(nullable = false)
	private String filePath;

	@Column(nullable = false)
	private String contentType;

	@Column(nullable = false)
	private Long fileSize;
}

