package com.nuriwoolim.pagebackend;

import com.nuriwoolim.pagebackend.domain.user.entity.UserType;
import com.nuriwoolim.pagebackend.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dev")
public class DevController {

    private final UserService userService;

    @GetMapping("/change-role")
    public void changeRole(@RequestParam String email, @RequestParam UserType role) {
        userService.DEVchangeRole(email, role);
    }
}
