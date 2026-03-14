package com.nuriwoolim.pagebackend.global.permission.dto;

public record PermissionDto(
	boolean canRead,
	boolean canWrite,
	boolean canEdit,
	boolean canDelete
) {
	public static PermissionDto forBoard(boolean canRead, boolean canWrite) {
		return new PermissionDto(canRead, canWrite, false, false);
	}

	public static PermissionDto forPost(boolean canEdit, boolean canDelete) {
		return new PermissionDto(false, false, canEdit, canDelete);
	}

	public static PermissionDto forComment(boolean canEdit, boolean canDelete) {
		return new PermissionDto(false, false, canEdit, canDelete);
	}
}
