package com.nuriwoolim.pagebackend.domain.post.util;

import org.springframework.stereotype.Component;

import com.nuriwoolim.pagebackend.domain.post.dto.PostPermissionContext;
import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.global.permission.dto.PermissionDto;
import com.nuriwoolim.pagebackend.global.permission.util.PermissionPolicy;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Component
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PostPermissionResolver {
	public static final PermissionPolicy<PostPermissionContext> CAN_EDIT =
		(role, context) -> switch (role) {
			case ADMIN, MANAGER, MEMBER -> context.post().getWriter().getId().equals(context.userId());
			case NONMEMBER -> false;
		};

	public static final PermissionPolicy<PostPermissionContext> CAN_DELETE =
		(role, context) -> switch (role) {
			case ADMIN, MANAGER -> true;
			case MEMBER -> context.post().getWriter().getId().equals(context.userId());
			case NONMEMBER -> false;
		};

	public PermissionDto resolve(UserType role, PostPermissionContext context) {
		return PermissionDto.forPost(
			PostPermissionResolver.CAN_EDIT.evaluate(role, context),
			PostPermissionResolver.CAN_DELETE.evaluate(role, context)
		);
	}
}
