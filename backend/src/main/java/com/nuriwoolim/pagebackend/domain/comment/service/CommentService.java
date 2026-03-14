package com.nuriwoolim.pagebackend.domain.comment.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nuriwoolim.pagebackend.domain.comment.dto.CommentCreateRequest;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentListResponse;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentResponse;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentUpdateRequest;
import com.nuriwoolim.pagebackend.domain.comment.entity.Comment;
import com.nuriwoolim.pagebackend.domain.comment.repository.CommentRepository;
import com.nuriwoolim.pagebackend.domain.comment.util.CommentMapper;
import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import com.nuriwoolim.pagebackend.domain.post.service.PostService;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

	private final CommentRepository commentRepository;
	private final UserService userService;
	private final PostService postService;

	@Transactional
	public CommentResponse create(Long postId, CommentCreateRequest request, Long actorId) {
		User writer = userService.getUserById(actorId);
		Post post = postService.getPostById(postId);

		Comment comment = CommentMapper.fromCommentCreateRequest(request, writer, post);
		Comment savedComment = commentRepository.save(comment);
		return CommentMapper.toCommentResponse(savedComment);
	}

	@Transactional(readOnly = true)
	public CommentListResponse findCommentList(Long postId, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<Comment> commentPage = commentRepository.findByPostId(postId, pageable);

		return CommentMapper.toCommentListResponse(commentPage);
	}

	@Transactional(readOnly = true)
	public Comment getCommentById(Long commentId) {
		return commentRepository.findById(commentId)
			.orElseThrow(ErrorCode.DATA_NOT_FOUND::toException);
	}

	@Transactional(readOnly = true)
	public CommentResponse getById(Long commentId) {
		return CommentMapper.toCommentResponse(getCommentById(commentId));
	}

	@Transactional
	public void deleteById(Long commentId, Long actorId) {
		Comment comment = getCommentById(commentId);
		validateCommentDeletePermission(actorId, comment);
		commentRepository.delete(comment);
	}

	@Transactional
	public CommentResponse updateById(Long commentId, CommentUpdateRequest request, Long actorId) {
		Comment comment = getCommentById(commentId);
		validateCommentUpdatePermission(actorId, comment);

		comment.update(request);
		return CommentMapper.toCommentResponse(comment);
	}

	private void validateCommentDeletePermission(Long actorId, Comment comment) {
		if (!comment.getWriter().getId().equals(actorId) && !userService.isAdmin(actorId)) {
			throw ErrorCode.DATA_FORBIDDEN.toException();
		} // 작성자 & ADMIN은 댓글 삭제 가능
	}

	private void validateCommentUpdatePermission(Long actorId, Comment comment) {
		if (!comment.getWriter().getId().equals(actorId)) {
			throw ErrorCode.DATA_FORBIDDEN.toException();
		} // 원 작성자만이 댓글 수정 가능
	}
}

