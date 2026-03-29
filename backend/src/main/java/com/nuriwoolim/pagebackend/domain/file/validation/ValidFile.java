package com.nuriwoolim.pagebackend.domain.file.validation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Constraint(validatedBy = ValidFileValidator.class)
@Target({ElementType.PARAMETER, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidFile {
	String message() default "유효하지 않은 파일입니다";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	long maxSize() default 10 * 1024 * 1024; // 10MB

	String[] allowedTypes() default {};
}
