package com.nuriwoolim.pagebackend.domain.post.repository;

import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
    boolean existsByBoardIdAndTitle(Long boardId, String title);
    @EntityGraph(attributePaths = {"writer", "board"})
    Page<Post> findByBoardId(Long boardId, Pageable pageable);
}
