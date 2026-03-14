package com.nuriwoolim.pagebackend.domain.post.permission;

import org.springframework.stereotype.Component;

import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.global.permission.dto.PermissionDto;

@Component
public class PostPermissionEvaluator {
	public PermissionDto evaluate(UserType role, PostPermissionContext context) {
		return PermissionDto.forPost(
			PostPermissionPolicies.CAN_EDIT.evaluate(role, context),
			PostPermissionPolicies.CAN_DELETE.evaluate(role, context)
		);
	}
}
