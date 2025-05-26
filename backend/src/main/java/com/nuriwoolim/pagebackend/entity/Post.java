package com.nuriwoolim.pagebackend.entity;

import com.nuriwoolim.pagebackend.core.BaseEntity;
import com.nuriwoolim.pagebackend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(
        indexes = {
                @Index(name = "idx_post_writer", columnList = "writer_id"),
                @Index(name = "idx_post_board", columnList = "board_id")
        }
)
@Builder
@AllArgsConstructor
public class Post extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 20, nullable = false)
    private String title;

    @Column(length = 65_535, nullable = false)
    @Lob
    private String content;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PostType type = PostType.GENERAL;

    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY, optional = false)
    @JoinColumn(
            nullable = false,
            foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private User writer;

    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY, optional = false)
    @JoinColumn(
            nullable = false,
            foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Board board;

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Comment> commentList = new ArrayList<>();
}
