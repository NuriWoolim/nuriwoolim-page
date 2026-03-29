package com.nuriwoolim.pagebackend.domain.user.service;

import com.nuriwoolim.pagebackend.domain.user.dto.ChangePasswordRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.domain.user.exception.UserErrorCode;
import com.nuriwoolim.pagebackend.domain.user.repository.UserRepository;
import com.nuriwoolim.pagebackend.domain.user.util.UserMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Transactional(readOnly = true)
	public UserResponse findById(Long userId) {
		User user = getUserById(userId);
		return UserMapper.toUserResponse(user);
	}

	/**
	 * 현재 비밀번호를 확인한 뒤 새 비밀번호로 변경한다.
	 *
	 * @param userId 비밀번호를 변경할 사용자 ID
	 * @param request 비밀번호 변경 요청
	 */
	@Transactional
	public void changePassword(Long userId, ChangePasswordRequest request) {
		User user = getUserById(userId);

		if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
			throw UserErrorCode.PASSWORD_BAD_REQUEST.toException("현재 비밀번호가 일치하지 않습니다.");
		}

		if (!request.newPassword().equals(request.newPasswordConfirm())) {
			throw UserErrorCode.PASSWORD_BAD_REQUEST.toException("새 비밀번호 확인이 일치하지 않습니다.");
		}

		if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
			throw UserErrorCode.PASSWORD_BAD_REQUEST.toException("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
		}

		user.updatePassword(passwordEncoder.encode(request.newPassword()));
	}

	@Transactional
	public void delete(Long id) {
		userRepository.deleteById(id);
	}

	@Transactional(readOnly = true)
	public User getUserById(Long userId) {
		return userRepository.findById(userId)
			.orElseThrow(UserErrorCode.USER_NOT_FOUND::toException);
	}

	@Transactional(readOnly = true)
	public User getUserByEmail(String email) {
		return userRepository.findByEmail(email)
			.orElseThrow(UserErrorCode.USER_NOT_FOUND::toException);
	}

	@Transactional(readOnly = true)
	public boolean isManager(Long userId) {
		User user = getUserById(userId);
		return user.getType() == UserType.ADMIN || user.getType() == UserType.MANAGER;
	}

	@Transactional(readOnly = true)
	public boolean isAdmin(Long userId) {
		User user = getUserById(userId);
		return user.getType() == UserType.ADMIN;
	}

	@Transactional(readOnly = true)
	public UserType getUserTypeById(Long userId) {
		return getUserById(userId).getType();
	}

	//TODO: 운영시 제거
	@Transactional
	public void DEVchangeRole(String email, UserType userType) {
		User user = getUserByEmail(email);
		user.updateRole(userType);
	}

}
