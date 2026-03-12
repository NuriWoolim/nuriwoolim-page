package com.nuriwoolim.pagebackend.domain.user.dto;

import java.time.LocalDateTime;

import com.nuriwoolim.pagebackend.domain.user.entity.UserType;

import lombok.Builder;

@Builder
public record UserResponse(
	Long id,
	String name,
	String email,
	UserType type,
	Integer year,
	LocalDateTime createdDate
) {

}
