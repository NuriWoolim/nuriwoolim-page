package com.nuriwoolim.pagebackend.domain.comment.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nuriwoolim.pagebackend.domain.comment.dto.CommentCreateRequest;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentListResponse;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentPermissionContext;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentResponse;
import com.nuriwoolim.pagebackend.domain.comment.dto.CommentUpdateRequest;
import com.nuriwoolim.pagebackend.domain.comment.entity.Comment;
import com.nuriwoolim.pagebackend.domain.comment.repository.CommentRepository;
import com.nuriwoolim.pagebackend.domain.comment.util.CommentMapper;
import com.nuriwoolim.pagebackend.domain.comment.util.CommentPermissionResolver;
import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import com.nuriwoolim.pagebackend.domain.post.service.PostService;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import com.nuriwoolim.pagebackend.global.exception.GlobalErrorCode;
import com.nuriwoolim.pagebackend.global.permission.dto.PermissionDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

	private final CommentRepository commentRepository;
	private final UserService userService;
	private final PostService postService;
	private final CommentPermissionResolver commentPermissionResolver;

	@Transactional
	public CommentResponse create(Long postId, CommentCreateRequest request, Long actorId) {
		User writer = userService.getUserById(actorId);
		Post post = postService.getPostById(postId);

		Comment comment = CommentMapper.fromCommentCreateRequest(request, writer, post);
		Comment savedComment = commentRepository.save(comment);

		UserType role = userService.getUserTypeById(actorId);
		return CommentMapper.toCommentResponse(savedComment, resolvePermission(savedComment, actorId, role));
	}

	@Transactional(readOnly = true)
	public CommentListResponse findCommentList(Long postId, int page, int size, Long actorId) {
		Pageable pageable = PageRequest.of(page, size);
		Page<Comment> commentPage = commentRepository.findByPostId(postId, pageable);

		UserType role = userService.getUserTypeById(actorId);

		return CommentMapper.toCommentListResponse(
			commentPage,
			comment -> resolvePermission(comment, actorId, role));
	}

	@Transactional(readOnly = true)
	public Comment getCommentById(Long commentId) {
		return commentRepository.findById(commentId)
			.orElseThrow(GlobalErrorCode.DATA_NOT_FOUND::toException);
	}

	@Transactional(readOnly = true)
	public CommentResponse getById(Long commentId, Long actorId) {
		Comment comment = getCommentById(commentId);

		UserType role = userService.getUserTypeById(actorId);
		return CommentMapper.toCommentResponse(comment, resolvePermission(comment, actorId, role));
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

		UserType role = userService.getUserTypeById(actorId);
		return CommentMapper.toCommentResponse(comment, resolvePermission(comment, actorId, role));
	}

	private void validateCommentDeletePermission(Long actorId, Comment comment) {
		if (!comment.getWriter().getId().equals(actorId) && !userService.isAdmin(actorId)) {
			throw GlobalErrorCode.DATA_FORBIDDEN.toException();
		}
	}

	private void validateCommentUpdatePermission(Long actorId, Comment comment) {
		if (!comment.getWriter().getId().equals(actorId)) {
			throw GlobalErrorCode.DATA_FORBIDDEN.toException();
		}
	}

	//외부에서 permission 주입
	private PermissionDto resolvePermission(Comment comment, Long actorId, UserType role) {
		CommentPermissionContext context = new CommentPermissionContext(comment, actorId);
		return commentPermissionResolver.resolve(role, context);
	}
}

