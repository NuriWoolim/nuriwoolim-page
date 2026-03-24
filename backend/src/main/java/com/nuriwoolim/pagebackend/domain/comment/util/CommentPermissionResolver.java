package com.nuriwoolim.pagebackend.domain.comment.util;

import org.springframework.stereotype.Component;

import com.nuriwoolim.pagebackend.domain.comment.dto.CommentPermissionContext;
import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.global.permission.dto.PermissionDto;
import com.nuriwoolim.pagebackend.global.permission.util.PermissionPolicy;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Component
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class CommentPermissionResolver {

	public static final PermissionPolicy<CommentPermissionContext> CAN_EDIT =
		(role, context) -> switch (role) {
			case ADMIN, MANAGER, MEMBER -> context.comment().getWriter().getId().equals(context.userId());
			case NONMEMBER -> false;
		};

	public static final PermissionPolicy<CommentPermissionContext> CAN_DELETE =
		(role, context) -> switch (role) {
			case ADMIN, MANAGER -> true;
			case MEMBER -> context.comment().getWriter().getId().equals(context.userId());
			case NONMEMBER -> false;
		};

	public PermissionDto resolve(UserType role, CommentPermissionContext context) {
		return PermissionDto.forComment(
			CAN_EDIT.evaluate(role, context),
			CAN_DELETE.evaluate(role, context)
		);
	}
}

