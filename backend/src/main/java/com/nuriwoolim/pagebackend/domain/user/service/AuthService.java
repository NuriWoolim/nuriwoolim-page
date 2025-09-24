package com.nuriwoolim.pagebackend.domain.user.service;

import com.nuriwoolim.pagebackend.core.jwt.RefreshTokenRepository;
import com.nuriwoolim.pagebackend.core.jwt.entity.RefreshToken;
import com.nuriwoolim.pagebackend.core.jwt.util.JwtTokenProvider;
import com.nuriwoolim.pagebackend.core.security.CustomUserDetails;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginDTO;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.PasswordResetRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.TokenPair;
import com.nuriwoolim.pagebackend.domain.user.dto.UserSignupRequest;
import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerificationType;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.repository.UserRepository;
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

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserService userService;
    private final EmailVerificationService emailVerificationService;

    @Transactional
    public void signUp(UserSignupRequest userSignupRequest) {
        checkEmail(userSignupRequest.email());

        emailVerificationService.verifyEmail(userSignupRequest.email(), userSignupRequest.code(),
            EmailVerificationType.SIGNUP);

        emailVerificationService.deleteVerification(userSignupRequest.email());

        String encodedPassword = passwordEncoder.encode(userSignupRequest.password());

        User user = UserMapper.fromUserSignupRequest(userSignupRequest, encodedPassword);

        userRepository.save(user);
    }

    @Transactional
    public void checkEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            throw ErrorCode.DATA_CONFLICT.toException("이미 존재하는 사용자입니다.");
        }
    }

    @Transactional
    public LoginDTO login(LoginRequest loginRequest) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
            loginRequest.email(),
            loginRequest.password());
        Authentication auth = authenticationManager.authenticate(authenticationToken);
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();

        TokenPair tokenPair = jwtTokenProvider.issueTokenPair(userDetails.getUser());

        Optional<RefreshToken> userRefreshToken = refreshTokenRepository.findByUser(
            userDetails.getUser());
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
            TokenPair tokenPair = jwtTokenProvider.issueTokenPair(userRefreshToken.get().getUser());

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

    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        User user = userService.getUserByEmail(request.email());
        emailVerificationService.verifyEmail(request.email(), request.code(),
            EmailVerificationType.RESET_PASSWORD);

        String encodedPassword = passwordEncoder.encode(request.password());
        user.updatePassword(encodedPassword);

        emailVerificationService.deleteVerification(user.getEmail());
    }
}
