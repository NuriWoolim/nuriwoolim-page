package com.nuriwoolim.pagebackend.domain.user.service;

import com.nuriwoolim.pagebackend.core.jwt.RefreshTokenRepository;
import com.nuriwoolim.pagebackend.core.jwt.entity.RefreshToken;
import com.nuriwoolim.pagebackend.core.jwt.util.JwtTokenProvider;
import com.nuriwoolim.pagebackend.core.security.CustomUserDetails;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginDTO;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.TokenPair;
import com.nuriwoolim.pagebackend.domain.user.dto.UserSignupRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.VerificationResendResponse;
import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerification;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.repository.EmailVerificationRepository;
import com.nuriwoolim.pagebackend.domain.user.repository.UserRepository;
import com.nuriwoolim.pagebackend.domain.user.util.CodeGenerator;
import com.nuriwoolim.pagebackend.domain.user.util.UserMapper;
import com.nuriwoolim.pagebackend.global.email.service.EmailService;
import com.nuriwoolim.pagebackend.global.exception.ErrorCode;
import io.jsonwebtoken.JwtException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${custom.resendLimit}")
    private int resendLimit;

    @Transactional
    public void signUp(UserSignupRequest userSignupRequest) {
        if (userRepository.existsByEmail(userSignupRequest.email())) {
            throw ErrorCode.DATA_CONFLICT.toException();
        }
        Optional<EmailVerification> emailVerification = emailVerificationRepository.findByEmail(
            userSignupRequest.email());
        if (emailVerification.isEmpty()) {
            throw ErrorCode.DATA_NOT_FOUND.toException();
        }
        if (!emailVerification.get().getCode().equals(userSignupRequest.code())) {
            throw ErrorCode.INVALID_EMAIL_CODE.toException();
        }

        emailVerificationRepository.deleteByEmail(userSignupRequest.email());
        emailVerificationRepository.flush();

        String encodedPassword = passwordEncoder.encode(userSignupRequest.password());

        User user = UserMapper.fromUserSignupRequest(userSignupRequest, encodedPassword);

        userRepository.save(user);
    }

    @Transactional
    public VerificationResendResponse sendVerificationEmail(String email) {
        String code = CodeGenerator.generateCode();
        String resendToken = jwtTokenProvider.issueEmailToken(email);

        if (emailVerificationRepository.existsByEmail(email)) {
            emailVerificationRepository.deleteByEmail(email);
            emailVerificationRepository.flush();
        }

        EmailVerification emailVerification = emailVerificationRepository.save(
            UserMapper.toEmailCode(email, code, resendToken));
        emailService.sendVerificationEmail(email, code);
        return UserMapper.toVerificationResendResponse(emailVerification);
    }

    @Transactional
    public VerificationResendResponse resendVerificationEmail(String resendToken) {
        try {
            jwtTokenProvider.validate(resendToken);
        } catch (JwtException e) {
            throw ErrorCode.INVALID_TOKEN.toException();
        }

        EmailVerification emailVerification = emailVerificationRepository.findByResendToken(
                resendToken)
            .orElseThrow(ErrorCode.USER_NOT_FOUND::toException);

        if (emailVerification.getResendCount() >= resendLimit) {
            throw ErrorCode.TOO_MANY_RESEND.toException();
        }

        String newCode = CodeGenerator.generateCode();
        emailVerification.updateCode(newCode);
        emailVerification.countResend();

        emailService.sendVerificationEmail(emailVerification.getEmail(), newCode);

        return UserMapper.toVerificationResendResponse(emailVerification);
    }

    @Transactional
    public void verifyEmail(String email, String code) {
        if (userRepository.existsByEmail(email)) {
            throw ErrorCode.DATA_CONFLICT.toException("이미 존재하는 사용자입니다.");
        }
        Optional<EmailVerification> emailVerification = emailVerificationRepository.findByEmail(
            email);
        if (emailVerification.isEmpty()) {
            throw ErrorCode.DATA_NOT_FOUND.toException();
        }
        if (!emailVerification.get().getCode().equals(code)) {
            throw ErrorCode.INVALID_EMAIL_CODE.toException();
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
}
