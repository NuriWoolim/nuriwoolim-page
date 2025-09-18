package com.nuriwoolim.pagebackend.domain.board.dto;

import com.nuriwoolim.pagebackend.domain.board.entity.BoardType;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record BoardCreateRequest(
        @NotBlank
        String title,
        @NotBlank
        String description,
        BoardType type
) {
}
