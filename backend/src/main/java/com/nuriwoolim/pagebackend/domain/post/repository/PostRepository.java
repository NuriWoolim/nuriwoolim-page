package com.nuriwoolim.pagebackend.domain.post.repository;

import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository  extends JpaRepository<Post, Long> {
    boolean existsByBoardIdAndTitle(Long boardId, String title);
    List<Post> findByBoardId(Long boardId);
    Optional<Post> findByIdAndBoardId(Long postId, Long boardId);
}
