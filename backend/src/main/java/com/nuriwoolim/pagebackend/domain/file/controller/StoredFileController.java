package com.nuriwoolim.pagebackend.domain.file.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.nuriwoolim.pagebackend.domain.file.dto.StoredFileResponse;
import com.nuriwoolim.pagebackend.domain.file.service.StoredFileService;
import com.nuriwoolim.pagebackend.domain.file.validation.ValidFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
@Validated
@Tag(name = "파일 관리", description = "파일 업로드, 다운로드, 조회, 삭제 API (ADMIN 권한 필요)")
public class StoredFileController {

	private final StoredFileService storedFileService;

	@Operation(summary = "파일 업로드", description = "단일 파일을 업로드합니다. 최대 10MB까지 업로드 가능합니다.")
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<StoredFileResponse> upload(
		@RequestParam("file")
		@ValidFile(maxSize = 10 * 1024 * 1024, message = "파일은 필수이며 최대 10MB까지 업로드 가능합니다")
		MultipartFile file) {
		return ResponseEntity.status(HttpStatus.CREATED)
			.body(storedFileService.upload(file));
	}

	@Operation(summary = "파일 목록 조회 (페이징)", description = "업로드된 파일의 목록을 페이징으로 조회합니다.")
	@GetMapping
	public ResponseEntity<Page<StoredFileResponse>> getAll(
		@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
		return ResponseEntity.ok(storedFileService.getAll(pageable));
	}

	@Operation(summary = "파일 정보 조회", description = "특정 파일의 메타데이터를 조회합니다.")
	@GetMapping("/{fileId}")
	public ResponseEntity<StoredFileResponse> getById(@PathVariable Long fileId) {
		return ResponseEntity.ok(storedFileService.getById(fileId));
	}

	@Operation(summary = "파일 다운로드", description = "특정 파일을 다운로드합니다. 원본 파일명으로 다운로드됩니다.")
	@GetMapping("/{storedFileName}/download")
	public ResponseEntity<Resource> download(@PathVariable String storedFileName) {
		Resource resource = storedFileService.loadFileAsResource(storedFileName);
		String originalFileName = storedFileService.getOriginalFileName(storedFileName);
		String encodedFileName = URLEncoder.encode(originalFileName, StandardCharsets.UTF_8)
			.replace("+", "%20");

		return ResponseEntity.ok()
			.header(HttpHeaders.CONTENT_DISPOSITION,
				"attachment; filename*=UTF-8''" + encodedFileName)
			.body(resource);
	}

	@Operation(summary = "파일 삭제", description = "특정 파일을 삭제합니다. DB 기록과 실제 파일이 모두 삭제됩니다.")
	@DeleteMapping("/{fileId}")
	public ResponseEntity<Void> delete(@PathVariable Long fileId) {
		storedFileService.delete(fileId);
		return ResponseEntity.noContent().build();
	}
}
