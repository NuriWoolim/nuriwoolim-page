package com.nuriwoolim.pagebackend.domain.file.validation;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ValidFileValidator implements ConstraintValidator<ValidFile, MultipartFile> {

	private long maxSize;
	private String[] allowedTypes;

	@Override
	public void initialize(ValidFile constraintAnnotation) {
		this.maxSize = constraintAnnotation.maxSize();
		this.allowedTypes = constraintAnnotation.allowedTypes();
	}

	@Override
	public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
		if (file == null || file.isEmpty()) {
			context.disableDefaultConstraintViolation();
			context.buildConstraintViolationWithTemplate("파일이 비어있습니다")
				.addConstraintViolation();
			return false;
		}

		// 파일 크기 검증
		if (file.getSize() > maxSize) {
			context.disableDefaultConstraintViolation();
			context.buildConstraintViolationWithTemplate(
					String.format("파일 크기가 %dMB를 초과합니다", maxSize / (1024 * 1024)))
				.addConstraintViolation();
			return false;
		}

		// 파일 타입 검증 (allowedTypes가 설정된 경우만)
		if (allowedTypes.length > 0) {
			String contentType = file.getContentType();
			if (contentType == null) {
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate("파일 타입을 확인할 수 없습니다")
					.addConstraintViolation();
				return false;
			}

			boolean typeAllowed = false;
			for (String allowedType : allowedTypes) {
				if (contentType.startsWith(allowedType)) {
					typeAllowed = true;
					break;
				}
			}

			if (!typeAllowed) {
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate(
						"허용되지 않는 파일 타입입니다: " + contentType)
					.addConstraintViolation();
				return false;
			}
		}

		return true;
	}
}
