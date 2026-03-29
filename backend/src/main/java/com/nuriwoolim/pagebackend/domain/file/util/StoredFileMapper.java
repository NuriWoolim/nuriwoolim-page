package com.nuriwoolim.pagebackend.domain.file.util;

import com.nuriwoolim.pagebackend.domain.file.dto.StoredFileResponse;
import com.nuriwoolim.pagebackend.domain.file.entity.StoredFile;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class StoredFileMapper {

	public static StoredFileResponse toResponse(StoredFile file) {
		return StoredFileResponse.builder()
			.id(file.getId())
			.path(file.getFilePath())
			.contentType(file.getContentType())
			.fileSize(file.getFileSize())
			.build();
	}
}


