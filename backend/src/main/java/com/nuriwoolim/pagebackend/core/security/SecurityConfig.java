package com.nuriwoolim.pagebackend.core.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
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
				.requestMatchers("/dev/**").permitAll() // TODO: 개발 전용 API 이므로 추후 삭제
				.requestMatchers("/auth/**",
					"/v3/api-docs/**",
					"/swagger-ui.html",
					"/swagger-ui/**",
					"/swagger-resources/**",
					"/webjars/**",
					"/refresh").permitAll()
				.requestMatchers("/admin/**").hasAnyRole("ADMIN", "MANAGER")
				.requestMatchers(HttpMethod.GET, "/boards").permitAll() //list only
				.requestMatchers("/boards/**").hasAnyRole("ADMIN", "MANAGER", "MEMBER") //everything else
				.requestMatchers("/posts/**").hasAnyRole("ADMIN", "MANAGER", "MEMBER")
				.requestMatchers("/comments/**").hasAnyRole("ADMIN", "MANAGER", "MEMBER")
				.requestMatchers("/users/**").authenticated()
				.requestMatchers("/files/{storedFileName}/download").permitAll()
				.requestMatchers("/files/**").hasAnyRole("ADMIN")
				.requestMatchers("/schedules/**").hasAnyRole("MANAGER", "ADMIN")
				.requestMatchers(HttpMethod.POST).hasAnyRole("ADMIN", "MANAGER", "MEMBER")
				.requestMatchers(HttpMethod.PATCH).hasAnyRole("ADMIN", "MANAGER", "MEMBER")
				.requestMatchers(HttpMethod.DELETE).hasAnyRole("ADMIN", "MANAGER", "MEMBER")
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
