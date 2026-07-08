package com.tuapi.service;

import com.tuapi.model.PasswordResetToken;
import com.tuapi.model.Usuario;
import com.tuapi.repository.PasswordResetTokenRepository;
import com.tuapi.repository.UsuarioRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetService(PasswordResetTokenRepository tokenRepository, UsuarioService usuarioService,
                                UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.tokenRepository = tokenRepository;
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String crearToken(String email) {
        Usuario usuario = usuarioService.buscarPorEmail(email);
        if (usuario == null) {
            throw new IllegalArgumentException("Email no registrado");
        }
        tokenRepository.deleteByEmail(email);
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEmail(email);
        resetToken.setToken(token);
        resetToken.setExpiracion(LocalDateTime.now().plusHours(1));
        resetToken.setUsado(false);
        tokenRepository.save(resetToken);
        return token;
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token invalido"));
        if (resetToken.isUsado()) {
            throw new IllegalArgumentException("Token ya usado");
        }
        if (resetToken.getExpiracion().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token expirado");
        }
        Usuario usuario = usuarioRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);
        resetToken.setUsado(true);
        tokenRepository.save(resetToken);
    }
}
