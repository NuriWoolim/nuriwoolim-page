package com.nuriwoolim.pagebackend.domain.comment.util;

import java.util.List;

import org.springframework.data.domain.Page;

import com.nuriwoolim.pagebackend.domain.comment.dto.CommentCreateRequest;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentListResponse;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentResponse;
import com.nuriwoolim.pagebackend.domain.comment.entity.Comment;
import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import com.nuriwoolim.pagebackend.domain.user.entity.User;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class CommentMapper {

	public static CommentResponse toCommentResponse(Comment comment) {
		return CommentResponse.builder()
			.id(comment.getId())
			.content(comment.getContent())
			.writerId(comment.getWriter().getId())
			.writerName(comment.getWriter().getName())
			.postId(comment.getPost().getId())
			.postTitle(comment.getPost().getTitle())
			.build();
	}

	public static Comment fromCommentCreateRequest(CommentCreateRequest request, User writer, Post post) {
		return Comment.builder()
			.content(request.content())
			.writer(writer)
			.post(post)
			.build();
	}

	public static CommentListResponse toCommentListResponse(Page<Comment> commentPage) {
		List<CommentResponse> data = commentPage.getContent().stream()
			.map(CommentMapper::toCommentResponse)
			.toList();

		return CommentListResponse.builder()
			.data(data)
			.totalElements(commentPage.getTotalElements())
			.totalPages(commentPage.getTotalPages())
			.currentPage(commentPage.getNumber())
			.build();
	}
}

