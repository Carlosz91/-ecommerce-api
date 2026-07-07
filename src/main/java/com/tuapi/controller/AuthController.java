package com.tuapi.controller;

import com.tuapi.config.security.JwtUtil;
import com.tuapi.config.security.LoginAttemptService;
import com.tuapi.config.security.TokenBlacklistService;
import com.tuapi.dto.request.LoginRequest;
import com.tuapi.dto.request.UsuarioRequest;
import com.tuapi.dto.response.TokenResponse;
import com.tuapi.dto.response.UsuarioResponse;
import com.tuapi.model.Usuario;
import com.tuapi.repository.UsuarioRepository;
import com.tuapi.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final LoginAttemptService loginAttemptService;
    private final TokenBlacklistService blacklistService;

    public AuthController(UsuarioService usuarioService, UsuarioRepository usuarioRepository,
                          JwtUtil jwtUtil, PasswordEncoder passwordEncoder,
                          LoginAttemptService loginAttemptService, TokenBlacklistService blacklistService) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.loginAttemptService = loginAttemptService;
        this.blacklistService = blacklistService;
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponse> register(@Valid @RequestBody UsuarioRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(usuarioService.registrarUsuario(request.getNombre(), request.getEmail(), request.getPassword()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        if (loginAttemptService.isBlocked(request.getEmail())) {
            return ResponseEntity.status(429).body(
                    Map.of("status", 429, "message", "Demasiados intentos. Intenta en 15 minutos."));
        }
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElse(null);
        if (usuario == null || !passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            loginAttemptService.loginFailed(request.getEmail());
            return ResponseEntity.status(401).body(
                    Map.of("status", 401, "message", "Credenciales invalidas"));
        }
        loginAttemptService.loginSucceeded(request.getEmail());
        String accessToken = jwtUtil.generarAccessToken(usuario.getEmail());
        String refreshToken = jwtUtil.generarRefreshToken(usuario.getEmail());
        return ResponseEntity.ok(new TokenResponse(accessToken, refreshToken, usuario.getRol().name()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null || !jwtUtil.validarToken(refreshToken)) {
            return ResponseEntity.status(401).body(
                    Map.of("status", 401, "message", "Refresh token invalido"));
        }
        if (!"refresh".equals(jwtUtil.extraerTipo(refreshToken))) {
            return ResponseEntity.status(401).body(
                    Map.of("status", 401, "message", "Tipo de token incorrecto"));
        }
        String email = jwtUtil.extraerEmail(refreshToken);
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        if (usuario == null) {
            return ResponseEntity.status(401).body(
                    Map.of("status", 401, "message", "Usuario no encontrado"));
        }
        String newAccessToken = jwtUtil.generarAccessToken(email);
        String newRefreshToken = jwtUtil.generarRefreshToken(email);
        return ResponseEntity.ok(new TokenResponse(newAccessToken, newRefreshToken, usuario.getRol().name()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            blacklistService.invalidar(authHeader.substring(7));
        }
        return ResponseEntity.ok().build();
    }
}
