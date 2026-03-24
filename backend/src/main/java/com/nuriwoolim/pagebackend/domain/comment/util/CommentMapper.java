package com.nuriwoolim.pagebackend.domain.comment.util;

import java.util.List;
import java.util.function.Function;

import org.springframework.data.domain.Page;

import com.nuriwoolim.pagebackend.domain.comment.dto.CommentCreateRequest;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentListResponse;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentResponse;
import com.nuriwoolim.pagebackend.domain.comment.entity.Comment;
import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.global.permission.dto.PermissionDto;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class CommentMapper {

	public static CommentResponse toCommentResponse(Comment comment, PermissionDto permission) {
		return CommentResponse.builder()
			.id(comment.getId())
			.content(comment.getContent())
			.writerId(comment.getWriter().getId())
			.writerName(comment.getWriter().getName())
			.postId(comment.getPost().getId())
			.postTitle(comment.getPost().getTitle())
			.permission(permission)
			.build();
	}

	public static Comment fromCommentCreateRequest(CommentCreateRequest request, User writer, Post post) {
		return Comment.builder()
			.content(request.content())
			.writer(writer)
			.post(post)
			.build();
	}

	public static CommentListResponse toCommentListResponse(Page<Comment> commentPage,
		Function<Comment, PermissionDto> permissionResolver) {
		List<CommentResponse> data = commentPage.getContent().stream()
			.map(comment -> toCommentResponse(comment, permissionResolver.apply(comment)))
			.toList();

		return CommentListResponse.builder()
			.data(data)
			.totalElements(commentPage.getTotalElements())
			.totalPages(commentPage.getTotalPages())
			.currentPage(commentPage.getNumber())
			.build();
	}
}
