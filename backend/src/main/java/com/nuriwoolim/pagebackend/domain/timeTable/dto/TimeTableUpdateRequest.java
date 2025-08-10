package com.nuriwoolim.pagebackend.domain.timeTable.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record TimeTableUpdateRequest(
    @NotBlank
    String title,
    String description,
    @NotBlank
    String team,

    @NotNull
    LocalDateTime start,
    @NotNull
    LocalDateTime end
) {

}
