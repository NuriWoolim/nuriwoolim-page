package com.nuriwoolim.pagebackend.domain.user.service;

import com.nuriwoolim.pagebackend.core.jwt.RefreshTokenRepository;
import com.nuriwoolim.pagebackend.core.jwt.entity.RefreshToken;
import com.nuriwoolim.pagebackend.core.jwt.util.JwtTokenProvider;
import com.nuriwoolim.pagebackend.core.security.CustomUserDetails;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginDTO;
import com.nuriwoolim.pagebackend.domain.user.dto.LoginRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.PasswordResetRequest;
import com.nuriwoolim.pagebackend.domain.user.dto.PasswordResetResponse;
import com.nuriwoolim.pagebackend.domain.user.dto.TokenPair;
import com.nuriwoolim.pagebackend.domain.user.dto.UserSignupRequest;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.repository.UserRepository;
import com.nuriwoolim.pagebackend.domain.user.util.CodeGenerator;
import com.nuriwoolim.pagebackend.domain.user.util.UserMapper;
import com.nuriwoolim.pagebackend.global.exception.GlobalErrorCode;
import com.nuriwoolim.pagebackend.domain.user.exception.UserErrorCode;
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

    /**
     * 회원가입을 처리한다.
     *
     * @param userSignupRequest 회원가입 요청 정보
     */
    @Transactional
    public void signUp(UserSignupRequest userSignupRequest) {
        checkEmail(userSignupRequest.email());

        // 사전 이메일 인증에서 확정된 code와 가입 요청 code가 일치해야 가입 가능
        emailVerificationService.validateSignupVerified(userSignupRequest.email(),
            userSignupRequest.code());

        String encodedPassword = passwordEncoder.encode(userSignupRequest.password());
        User user = UserMapper.fromUserSignupRequest(userSignupRequest, encodedPassword);

        userRepository.save(user);
        emailVerificationService.clearSignupVerification(userSignupRequest.email());
    }

    /**
     * 회원가입용 이메일 인증 코드를 발송한다.
     *
     * @param email 인증 코드를 받을 이메일
     */
    @Transactional
    public void sendSignupVerification(String email) {
        checkEmail(email);
        emailVerificationService.sendSignupVerificationEmail(email);
    }

    /**
     * 회원가입용 인증 코드를 검증한다.
     *
     * @param email 인증 대상 이메일
     * @param code 인증 코드
     */
    @Transactional
    public void verifySignupEmail(String email, String code) {
        checkEmail(email);
        emailVerificationService.verifySignupEmail(email, code);
    }

    /**
     * 비밀번호 초기화용 이메일 인증 코드를 발송한다.
     *
     * @param email 인증 코드를 받을 이메일
     */
    @Transactional
    public void sendPasswordResetVerification(String email) {
        userService.getUserByEmail(email);
        emailVerificationService.sendPasswordResetVerificationEmail(email);
    }

    /**
     * 이메일 중복 여부를 검사한다.
     *
     * @param email 검사할 이메일
     */
    @Transactional
    public void checkEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            throw GlobalErrorCode.DATA_CONFLICT.toException("이미 존재하는 사용자입니다.");
        }
    }

    /**
     * 사용자 로그인 후 토큰 쌍을 발급한다.
     *
     * @param loginRequest 로그인 요청
     * @return 사용자 정보와 토큰 정보
     */
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

    /**
     * 리프레시 토큰으로 새로운 토큰 쌍을 발급한다.
     *
     * @param refreshToken 리프레시 토큰
     * @return 새 토큰 쌍
     */
    @Transactional
    public TokenPair refresh(String refreshToken) {
        try {
            jwtTokenProvider.validate(refreshToken);
        } catch (Exception e) {
            throw GlobalErrorCode.INVALID_TOKEN.toException();
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

        throw GlobalErrorCode.INVALID_TOKEN.toException();
    }

    /**
     * 리프레시 토큰을 저장하고 사용자와 연결한다.
     *
     * @param token 저장할 토큰
     * @param user 대상 사용자
     */
    private void saveRefreshToken(String token, User user) {
        RefreshToken refreshToken = RefreshToken.builder()
            .token(token)
            .user(user)
            .build();
        user.setRefreshToken(refreshToken);
        refreshTokenRepository.save(refreshToken);
    }

    /**
     * 로그아웃 시 리프레시 토큰을 제거한다.
     *
     * @param refreshToken 리프레시 토큰
     */
    @Transactional
    public void logout(String refreshToken) {
        try {
            jwtTokenProvider.validate(refreshToken);
        } catch (Exception e) {
            throw GlobalErrorCode.INVALID_TOKEN.toException();
        }
        refreshTokenRepository.deleteByToken(refreshToken);
    }

    /**
     * 인증 코드 확인 후 비밀번호를 임시 비밀번호로 초기화한다.
     *
     * @param request 비밀번호 초기화 요청
     * @return 임시 비밀번호
     */
    @Transactional
    public PasswordResetResponse resetPassword(PasswordResetRequest request) {
        User user = userService.getUserByEmail(request.email());
        emailVerificationService.verifyPasswordResetCode(request.email(), request.code());

        String temporaryPassword = CodeGenerator.generateTemporaryPassword();
        String encodedPassword = passwordEncoder.encode(temporaryPassword);
        user.updatePassword(encodedPassword);

        emailVerificationService.clearPasswordResetVerification(user.getEmail());

        return PasswordResetResponse.builder()
            .temporaryPassword(temporaryPassword)
            .build();
    }
}
