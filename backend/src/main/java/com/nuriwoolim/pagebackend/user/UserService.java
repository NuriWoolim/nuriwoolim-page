package com.nuriwoolim.pagebackend.user;

import com.nuriwoolim.pagebackend.util.exception.CustomException;
import com.nuriwoolim.pagebackend.util.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}
