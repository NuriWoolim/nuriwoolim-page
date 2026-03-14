package com.nuriwoolim.pagebackend.domain.comment.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.nuriwoolim.pagebackend.domain.comment.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

	@EntityGraph(attributePaths = {"writer", "post"})
	Page<Comment> findByPostId(Long postId, Pageable pageable);
}

