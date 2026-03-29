package com.nuriwoolim.pagebackend.domain.board.util;

import org.springframework.stereotype.Component;

import com.nuriwoolim.pagebackend.domain.board.dto.BoardPermissionContext;
import com.nuriwoolim.pagebackend.domain.board.entity.BoardType;
import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.global.permission.dto.PermissionDto;
import com.nuriwoolim.pagebackend.global.permission.util.PermissionPolicy;

import lombok.NoArgsConstructor;

@Component
@NoArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class BoardPermissionResolver {

	public static final PermissionPolicy<BoardPermissionContext> CAN_READ =
		(role, context) -> switch (role) {
			case ADMIN -> true;
			case MANAGER -> true;
			case MEMBER -> true;
			case NONMEMBER -> context.board().getType() != BoardType.ANNOUNCEMENT; // guests can't read NOTICE
		};

	public static final PermissionPolicy<BoardPermissionContext> CAN_WRITE =
		(role, context) -> role == UserType.ADMIN || role == UserType.MANAGER;

	public PermissionDto resolve(UserType role, BoardPermissionContext context) {
		return PermissionDto.forBoard(
			CAN_READ.evaluate(role, context),
			CAN_WRITE.evaluate(role, context)
		);
	}
}
