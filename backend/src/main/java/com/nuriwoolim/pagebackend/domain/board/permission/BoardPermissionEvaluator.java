package com.nuriwoolim.pagebackend.domain.board.permission;

import org.springframework.stereotype.Component;

import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.global.permission.dto.PermissionDto;

@Component
public class BoardPermissionEvaluator {

	public PermissionDto evaluate(UserType role, BoardPermissionContext context) {
		return PermissionDto.forBoard(
			BoardPermissionPolicies.CAN_READ.evaluate(role, context),
			BoardPermissionPolicies.CAN_WRITE.evaluate(role, context)
		);
	}
}
