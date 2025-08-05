package com.nuriwoolim.pagebackend.domain.timeTable.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record TimeTableCreateRequest(
    @NotBlank
    String title,
    String description,
    @NotBlank
    String team,
    LocalDateTime start,
    LocalDateTime end
) {

}
