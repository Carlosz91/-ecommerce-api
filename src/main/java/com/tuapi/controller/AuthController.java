package com.tuapi.controller;

import com.tuapi.config.security.JwtUtil;
import com.tuapi.config.security.LoginAttemptService;
import com.tuapi.config.security.TokenBlacklistService;
import com.tuapi.dto.request.GoogleLoginRequest;
import com.tuapi.dto.request.LoginRequest;
import com.tuapi.dto.request.UsuarioRequest;
import com.tuapi.dto.response.TokenResponse;
import com.tuapi.dto.response.UsuarioResponse;
import com.tuapi.model.Usuario;
import com.tuapi.repository.UsuarioRepository;
import com.tuapi.service.PasswordResetService;
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
    private final PasswordResetService passwordResetService;

    public AuthController(UsuarioService usuarioService, UsuarioRepository usuarioRepository,
                          JwtUtil jwtUtil, PasswordEncoder passwordEncoder,
                          LoginAttemptService loginAttemptService, TokenBlacklistService blacklistService,
                          PasswordResetService passwordResetService) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.loginAttemptService = loginAttemptService;
        this.blacklistService = blacklistService;
        this.passwordResetService = passwordResetService;
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
        String accessToken = jwtUtil.generarAccessToken(usuario.getEmail(), usuario.getRol().name());
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
        String newAccessToken = jwtUtil.generarAccessToken(email, usuario.getRol().name());
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

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        try {
            String[] parts = request.getIdToken().split("\\.");
            if (parts.length < 2) return ResponseEntity.status(401).body(Map.of("status", 401, "message", "Token invalido"));
            String payload = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            java.util.Map<String, Object> claims = mapper.readValue(payload, java.util.Map.class);
            String email = (String) claims.get("email");
            String nombre = (String) claims.get("name");
            String avatarUrl = (String) claims.get("picture");
            String googleId = (String) claims.get("sub");
            if (email == null) return ResponseEntity.status(401).body(Map.of("status", 401, "message", "Email no disponible"));
            Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
            if (usuario == null) {
                usuario = usuarioService.registrarOAuthUsuario(googleId, nombre, email, avatarUrl);
            } else if (usuario.getGoogleId() == null) {
                usuario.setGoogleId(googleId);
                usuario.setAvatarUrl(avatarUrl);
                usuarioRepository.save(usuario);
            }
            String accessToken = jwtUtil.generarAccessToken(usuario.getEmail(), usuario.getRol().name());
            String refreshToken = jwtUtil.generarRefreshToken(usuario.getEmail());
            return ResponseEntity.ok(new TokenResponse(accessToken, refreshToken, usuario.getRol().name()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("status", 401, "message", "Error al procesar token Google"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null) return ResponseEntity.badRequest().body(Map.of("status", 400, "message", "Email requerido"));
        try {
            passwordResetService.crearToken(email);
            return ResponseEntity.ok(Map.of("status", 200, "message", "Si el email existe, recibiras un enlace de recuperacion"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(Map.of("status", 200, "message", "Si el email existe, recibiras un enlace de recuperacion"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String password = body.get("password");
        if (token == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "message", "Token y password requeridos"));
        }
        try {
            passwordResetService.resetPassword(token, password);
            return ResponseEntity.ok(Map.of("status", 200, "message", "Contraseña actualizada correctamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("status", 400, "message", e.getMessage()));
        }
    }
}
