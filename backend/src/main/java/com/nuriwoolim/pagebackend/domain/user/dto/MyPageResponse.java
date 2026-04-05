package com.nuriwoolim.pagebackend.domain.user.dto;

import com.nuriwoolim.pagebackend.domain.user.entity.UserType;

import lombok.Builder;

@Builder
public record MyPageResponse(
	String name,
	String email,
	UserType type,
	Integer year,
	String studentNumber,
	String college,
	String major
) {
}
