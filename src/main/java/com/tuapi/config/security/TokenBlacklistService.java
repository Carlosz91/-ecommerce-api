package com.tuapi.config.security;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    private final Set<String> blacklist = ConcurrentHashMap.newKeySet();

    public void invalidar(String token) {
        blacklist.add(token);
    }

    public boolean estaInvalido(String token) {
        return blacklist.contains(token);
    }
}
