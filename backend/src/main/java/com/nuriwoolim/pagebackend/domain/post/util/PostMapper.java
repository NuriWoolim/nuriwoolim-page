package com.nuriwoolim.pagebackend.domain.post.util;

import java.util.List;

import org.springframework.data.domain.Page;

import com.nuriwoolim.pagebackend.domain.board.entity.Board;
import com.nuriwoolim.pagebackend.domain.post.dto.PostCreateRequest;
import com.nuriwoolim.pagebackend.domain.post.dto.PostListResponse;
import com.nuriwoolim.pagebackend.domain.post.dto.PostPreviewResponse;
import com.nuriwoolim.pagebackend.domain.post.dto.PostResponse;
import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.global.permission.dto.PermissionDto;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PostMapper {

	public static PostResponse toPostResponse(Post post, PermissionDto permission) {
		return PostResponse.builder()
			.id(post.getId())
			.title(post.getTitle())
			.content(post.getContent())
			.type(post.getType())
			.writerId(post.getWriter().getId())
			.writerName(post.getWriter().getName())
			.boardId(post.getBoard().getId())
			.boardTitle(post.getBoard().getTitle())
			.permission(permission)
			.build();
	}

	public static Post fromPostCreateRequest(PostCreateRequest request, User writer, Board board) {
		return Post.builder()
			.title(request.title())
			.content(request.content())
			.type(request.type())
			.writer(writer)
			.board(board)
			.build();
	}

	public static PostPreviewResponse toPostPreviewResponse(Post post) {
		return PostPreviewResponse.builder()
			.id(post.getId())
			.title(post.getTitle())
			.type(post.getType())
			.writerId(post.getWriter().getId())
			.writerName(post.getWriter().getName())
			.build();
	}

	public static PostListResponse toPostListResponse(Page<Post> postPage) {
		List<PostPreviewResponse> data = postPage.getContent().stream()
			.map(PostMapper::toPostPreviewResponse)
			.toList();

		return PostListResponse.builder()
			.data(data)
			.totalElements(postPage.getTotalElements())
			.totalPages(postPage.getTotalPages())
			.currentPage(postPage.getNumber())
			.build();
	}
}
