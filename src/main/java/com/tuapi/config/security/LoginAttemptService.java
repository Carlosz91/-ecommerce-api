package com.tuapi.config.security;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long BLOCK_TIME_MS = 900000;

    private final Map<String, Attempt> attempts = new ConcurrentHashMap<>();

    public void loginSucceeded(String email) {
        attempts.remove(email.toLowerCase());
    }

    public void loginFailed(String email) {
        String key = email.toLowerCase();
        Attempt attempt = attempts.computeIfAbsent(key, k -> new Attempt());
        synchronized (attempt) {
            attempt.count++;
            if (attempt.count >= MAX_ATTEMPTS) {
                attempt.blockedUntil = System.currentTimeMillis() + BLOCK_TIME_MS;
            }
        }
    }

    public boolean isBlocked(String email) {
        String key = email.toLowerCase();
        Attempt attempt = attempts.get(key);
        if (attempt == null) return false;
        synchronized (attempt) {
            if (attempt.blockedUntil > System.currentTimeMillis()) {
                return true;
            }
            if (attempt.blockedUntil > 0 && attempt.blockedUntil <= System.currentTimeMillis()) {
                attempts.remove(key);
            }
            return false;
        }
    }

    private static class Attempt {
        int count = 0;
        long blockedUntil = 0;
    }
}
