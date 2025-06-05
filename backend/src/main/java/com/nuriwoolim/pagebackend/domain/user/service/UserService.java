package com.nuriwoolim.pagebackend.domain.user.service;

import com.nuriwoolim.pagebackend.domain.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.UserUpdateRequest;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.repository.UserRepository;
import com.nuriwoolim.pagebackend.global.exception.CustomException;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    public User create(UserCreateRequest userCreateRequest) {
        return userRepository.save(User.of(userCreateRequest));
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    public User update(Long userId, UserUpdateRequest userUpdateRequest) {
        User user = findById(userId);
        user.update(userUpdateRequest);
        return userRepository.save(user);
    }
}
