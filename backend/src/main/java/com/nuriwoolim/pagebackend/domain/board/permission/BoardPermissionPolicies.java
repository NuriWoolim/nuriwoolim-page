package com.nuriwoolim.pagebackend.domain.board.permission;

import com.nuriwoolim.pagebackend.domain.board.entity.BoardType;
import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.global.permission.util.PermissionPolicy;

public class BoardPermissionPolicies {

	public static final PermissionPolicy<BoardPermissionContext> CAN_READ =
		(role, context) -> switch (role) {
			case ADMIN -> true;
			case MANAGER -> true;
			case MEMBER -> true;
			case NONMEMBER -> context.board().getType() != BoardType.ANNOUNCEMENT; // guests can't read NOTICE
		};

	public static final PermissionPolicy<BoardPermissionContext> CAN_WRITE =
		(role, context) -> role == UserType.ADMIN || role == UserType.MANAGER;
}
