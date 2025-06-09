package com.nuriwoolim.pagebackend.domain.user.service;

import com.nuriwoolim.pagebackend.core.jwt.JwtTokenProvider;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.util.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public UserResponse signUp(UserCreateRequest userCreateRequest) {
        User endcodedUser = UserMapper.fromUserCreateRequest(userCreateRequest,
                passwordEncoder.encode(userCreateRequest.password()));
        return userService.create(endcodedUser);
    }

    public LoginResponse login(LoginRequest loginRequest) {

        return new LoginResponse(null, null);
    }
}
