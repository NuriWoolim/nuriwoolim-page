package com.nuriwoolim.pagebackend.domain.user.service;

import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.repository.UserRepository;
import com.nuriwoolim.pagebackend.domain.user.util.UserMapper;
import com.nuriwoolim.pagebackend.global.exception.CustomException;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponse findById(Long userId) {
        User user = getUserById(userId);
        return UserMapper.toUserResponse(user);
    }

    @Transactional
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

}
