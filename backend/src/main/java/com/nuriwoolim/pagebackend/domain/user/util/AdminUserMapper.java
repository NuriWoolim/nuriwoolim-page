package com.nuriwoolim.pagebackend.domain.user.util;

import com.nuriwoolim.pagebackend.domain.comment.dto.CommentResponse;
import com.nuriwoolim.pagebackend.domain.comment.entity.Comment;
import com.nuriwoolim.pagebackend.domain.post.dto.PostResponse;
import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import com.nuriwoolim.pagebackend.domain.user.dto.AdminUserDetailResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.AdminUserSummaryResponse;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AdminUserMapper {

    public static AdminUserSummaryResponse toSummary(User user) {
        return AdminUserSummaryResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .type(user.getType())
            .year(user.getYear())
            .studentNumber(user.getStudentNumber())
            .createdAt(user.getCreatedAt())
            .build();
    }

    public static AdminUserDetailResponse toDetail(User user, int postCount, int commentCount) {
        return AdminUserDetailResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .type(user.getType())
            .year(user.getYear())
            .studentNumber(user.getStudentNumber())
            .college(user.getCollege())
            .major(user.getMajor())
            .postCount(postCount)
            .commentCount(commentCount)
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }

    public static PostResponse toPostResponse(Post post) {
        return PostResponse.builder()
            .id(post.getId())
            .title(post.getTitle())
            .content(post.getContent())
            .type(post.getType())
            .writerId(post.getWriter().getId())
            .writerName(post.getWriter().getName())
            .boardId(post.getBoard().getId())
            .boardTitle(post.getBoard().getTitle())
            .build();
    }

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
}

