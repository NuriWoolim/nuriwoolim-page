package com.nuriwoolim.pagebackend.domain.user.service;

import com.nuriwoolim.pagebackend.domain.user.dto.LoginRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;

    public UserResponse signUp(UserCreateRequest userCreateRequest) {
        return userService.create(userCreateRequest);
    }

    public LoginResponse login(LoginRequest loginRequest) {
        return new LoginResponse(null, null);
    }
}
