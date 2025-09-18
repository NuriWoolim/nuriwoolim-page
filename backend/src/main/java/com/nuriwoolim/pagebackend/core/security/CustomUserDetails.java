package com.nuriwoolim.pagebackend.core.security;

import com.nuriwoolim.pagebackend.domain.user.entity.User;
import java.util.Collection;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@AllArgsConstructor
@Builder
@Getter
public class CustomUserDetails implements UserDetails {

    private final String username;
    private final String password;
    private final User user;

    public static CustomUserDetails of(User user) {
        return CustomUserDetails.builder()
            .username(user.getEmail())
            .password(user.getPassword())
            .user(user)
            .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(user.getType().name()));
    }
}
