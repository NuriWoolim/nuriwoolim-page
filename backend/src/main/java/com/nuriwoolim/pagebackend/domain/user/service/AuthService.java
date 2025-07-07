package com.nuriwoolim.pagebackend.domain.user.service;

import com.nuriwoolim.pagebackend.core.jwt.RefreshTokenRepository;
import com.nuriwoolim.pagebackend.core.jwt.entity.RefreshToken;
import com.nuriwoolim.pagebackend.core.jwt.util.JwtTokenProvider;
import com.nuriwoolim.pagebackend.core.security.CustomUserDetails;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginDTO;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.TokenPair;
import com.nuriwoolim.pagebackend.domain.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.UserResponse;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.util.UserMapper;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenRepository refreshTokenRepository;


    @Transactional
    public UserResponse signUp(UserCreateRequest userCreateRequest) {
        User endcodedUser = UserMapper.fromUserCreateRequest(userCreateRequest,
                passwordEncoder.encode(userCreateRequest.password()));
        return userService.create(endcodedUser);
    }

    @Transactional
    public LoginDTO login(LoginRequest loginRequest) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginRequest.username(),
                loginRequest.password());
        Authentication auth = authenticationManager.authenticate(authenticationToken);
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();

        TokenPair tokenPair = jwtTokenProvider.issueTokenPair(userDetails.getUser().getId());

        Optional<RefreshToken> userRefreshToken = refreshTokenRepository.findByUser(userDetails.getUser());
        if (userRefreshToken.isPresent()) {
            userDetails.getUser().setRefreshToken(null);
            refreshTokenRepository.delete(userRefreshToken.get());
            refreshTokenRepository.flush();
        }

        saveRefreshToken(tokenPair.refreshToken(), userDetails.getUser());

        return new LoginDTO(UserMapper.toUserResponse(userDetails.getUser()), tokenPair);
    }

    @Transactional
    public TokenPair refresh(String refreshToken) {
        try {
            jwtTokenProvider.validate(refreshToken);
        } catch (Exception e) {
            throw ErrorCode.INVALID_TOKEN.toException();
        }
        Optional<RefreshToken> userRefreshToken = refreshTokenRepository.findByToken(refreshToken);
        if (userRefreshToken.isPresent()) {
            Long userId = userRefreshToken.get().getUser().getId();
            TokenPair tokenPair = jwtTokenProvider.issueTokenPair(userId);

            User user = userRefreshToken.get().getUser();
            user.setRefreshToken(null);
            refreshTokenRepository.delete(userRefreshToken.get());
            refreshTokenRepository.flush();

            saveRefreshToken(tokenPair.refreshToken(), user);

            return tokenPair;
        }
        throw ErrorCode.INVALID_TOKEN.toException();
    }

    private void saveRefreshToken(String token, User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .user(user)
                .build();
        user.setRefreshToken(refreshToken);
        refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public void logout(String refreshToken) {
        try {
            jwtTokenProvider.validate(refreshToken);
        } catch (Exception e) {
            throw ErrorCode.INVALID_TOKEN.toException();
        }
        refreshTokenRepository.deleteByToken(refreshToken);
    }
}
