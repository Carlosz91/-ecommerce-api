package com.tuapi.controller;

import com.tuapi.config.security.LoginAttemptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final LoginAttemptService loginAttemptService;

    public AdminController(LoginAttemptService loginAttemptService) {
        this.loginAttemptService = loginAttemptService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }

    @PostMapping("/unlock/{email}")
    public ResponseEntity<Void> unlockUser(@PathVariable String email) {
        loginAttemptService.loginSucceeded(email);
        return ResponseEntity.ok().build();
    }
}
