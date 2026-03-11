package com.nuriwoolim.pagebackend.global.permission.util;

import com.nuriwoolim.pagebackend.domain.user.entity.UserType;

@FunctionalInterface
public interface PermissionPolicy<T> {
	boolean evaluate(UserType role, T context);
}