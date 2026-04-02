package com.nuriwoolim.pagebackend.core.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.nuriwoolim.pagebackend.core.jwt.filter.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@EnableMethodSecurity
@EnableWebSecurity
@Configuration
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final CustomEntryPoint customEntryPoint;
	private final CustomAccessDeniedHandler customAccessDeniedHandler;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
			.formLogin(AbstractHttpConfigurer::disable)
			.httpBasic(AbstractHttpConfigurer::disable)
			.csrf(AbstractHttpConfigurer::disable)
			.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.exceptionHandling(e -> e
				.authenticationEntryPoint(customEntryPoint)
				.accessDeniedHandler(customAccessDeniedHandler))
			.authorizeHttpRequests(auth -> auth
				.requestMatchers(HttpMethod.OPTIONS).permitAll()

				// ── 공개 API ──
				.requestMatchers("/auth/**", "/dev/**").permitAll() // TODO: /dev/** 는 추후 삭제
				.requestMatchers("/v3/api-docs/**", "/swagger-ui.html",
					"/swagger-ui/**", "/swagger-resources/**", "/webjars/**").permitAll()
				.requestMatchers(HttpMethod.GET,
					"/boards", "/schedules", "/timetables", "/posts").permitAll()
				.requestMatchers(HttpMethod.GET, "/files/{storedFileName}/download").permitAll()

				// ── 인증만 필요 (역할 무관, NONMEMBER 포함) ──
				.requestMatchers("/users/**").authenticated()

				// ── 기본: MEMBER 이상 (세부 역할은 @PreAuthorize 로 제어) ──
				.anyRequest().hasAnyRole("ADMIN", "MANAGER", "MEMBER"));
		return http.build();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
		throws Exception {
		return config.getAuthenticationManager();
	}

}
