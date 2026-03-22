package com.nuriwoolim.pagebackend.domain.post.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nuriwoolim.pagebackend.domain.board.entity.Board;
import com.nuriwoolim.pagebackend.domain.board.entity.BoardType;
import com.nuriwoolim.pagebackend.domain.board.service.BoardService;
import com.nuriwoolim.pagebackend.domain.post.dto.PostCreateRequest;
import com.nuriwoolim.pagebackend.domain.post.dto.PostListResponse;
import com.nuriwoolim.pagebackend.domain.post.dto.PostResponse;
import com.nuriwoolim.pagebackend.domain.post.dto.PostUpdateRequest;
import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import com.nuriwoolim.pagebackend.domain.post.dto.PostPermissionContext;
import com.nuriwoolim.pagebackend.domain.post.repository.PostRepository;
import com.nuriwoolim.pagebackend.domain.post.util.PostMapper;
import com.nuriwoolim.pagebackend.domain.post.util.PostPermissionResolver;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import com.nuriwoolim.pagebackend.global.permission.dto.PermissionDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {
	private final PostRepository postRepository;
	private final UserService userService;
	private final BoardService boardService;
	private final PostPermissionResolver postPermissionResolver;

	@Transactional
	public PostResponse create(Long boardId, PostCreateRequest request, Long actorId) {
		User writer = userService.getUserById(actorId);
		Board board = boardService.getBoardById(boardId);

		validatePostCreatePermission(actorId, board.getType());

		Post post = PostMapper.fromPostCreateRequest(request, writer, board);
		Post savedPost = postRepository.save(post);
		return PostMapper.toPostResponse(savedPost, resolvePermission(savedPost, actorId));
	}

	@Transactional(readOnly = true)
	public PostListResponse findPostList(Long boardId, Integer page, Integer size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<Post> postPage = postRepository.findAll(pageable);

		return PostMapper.toPostListResponse(postPage);
	}

	@Transactional(readOnly = true)
	public Post getPostById(Long postId) { //service layer에서 쓸 함수
		return postRepository.findById(postId).orElseThrow(ErrorCode.DATA_NOT_FOUND::toException);
	}

	@Transactional(readOnly = true)
	public PostResponse getById(Long postId, Long actorId) { //controller에서 쓸 함수
		Post post = getPostById(postId);
		return PostMapper.toPostResponse(post, resolvePermission(post, actorId));
	}

	@Transactional
	public void deleteById(Long postId, Long actorId) {
		Post post = getPostById(postId);
		validatePostDeletePermission(actorId, post);
		postRepository.delete(post);
	}

	@Transactional
	public PostResponse updateById(Long postId, PostUpdateRequest request, Long actorId) {
		Post post = getPostById(postId);
		validatePostUpdatePermission(actorId, post);

		post.update(request);
		return PostMapper.toPostResponse(post, resolvePermission(post, actorId));
	}

	private void validatePostCreatePermission(Long actorId, BoardType boardType) {
		if (boardType == BoardType.ANNOUNCEMENT &&
			!(userService.isAdmin(actorId) || userService.isManager(actorId))) {
			throw ErrorCode.DATA_FORBIDDEN.toException();
		} // 공지는 ADMIN만 작성 가능
	}

	private void validatePostDeletePermission(Long actorId, Post post) {
		if (!post.getWriter().getId().equals(actorId) && !userService.isAdmin(actorId)) {
			throw ErrorCode.DATA_FORBIDDEN.toException();
		} // 작성자 & ADMIN은 게시물 삭제 가능
	}

	private void validatePostUpdatePermission(Long actorId, Post post) {
		if (!post.getWriter().getId().equals(actorId)) {
			throw ErrorCode.DATA_FORBIDDEN.toException();
		} // 원 작성자만이 게시물 수정 가능
	}

	private PermissionDto resolvePermission(Post post, Long actorId) {
		UserType role = userService.getUserTypeById(actorId);
		PostPermissionContext context = new PostPermissionContext(post, actorId);
		return postPermissionResolver.resolve(role, context);
	}
}
