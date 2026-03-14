package com.nuriwoolim.pagebackend.domain.post.permission;

import com.nuriwoolim.pagebackend.global.permission.util.PermissionPolicy;

public class PostPermissionPolicies {
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
}
