package com.tuapi.controller;

import com.tuapi.config.security.JwtUtil;
import com.tuapi.dto.request.ChangePasswordRequest;
import com.tuapi.dto.request.ProfileUpdateRequest;
import com.tuapi.dto.request.UsuarioRequest;
import com.tuapi.dto.response.UsuarioResponse;
import com.tuapi.model.Usuario;
import com.tuapi.repository.UsuarioRepository;
import jakarta.validation.Valid;
import com.tuapi.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioService service;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioService service, JwtUtil jwtUtil, UsuarioRepository usuarioRepository) {
        this.service = service;
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioResponse> perfil(@RequestHeader("Authorization") String auth) {
        String email = jwtUtil.extraerEmail(auth.substring(7));
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        UsuarioResponse response = new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol().name());
        response.setTelefono(usuario.getTelefono());
        response.setDireccion(usuario.getDireccion());
        response.setGoogleId(usuario.getGoogleId());
        response.setAvatarUrl(usuario.getAvatarUrl());
        response.setEmailVerified(usuario.isEmailVerified());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/perfil")
    public ResponseEntity<UsuarioResponse> actualizarPerfil(@RequestHeader("Authorization") String auth,
                                                             @RequestBody ProfileUpdateRequest request) {
        String email = jwtUtil.extraerEmail(auth.substring(7));
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(service.actualizarPerfil(usuario.getId(), request.getNombre(), request.getTelefono(), request.getDireccion()));
    }

    @PutMapping("/password")
    public ResponseEntity<?> cambiarPassword(@RequestHeader("Authorization") String auth,
                                              @Valid @RequestBody ChangePasswordRequest request) {
        String email = jwtUtil.extraerEmail(auth.substring(7));
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        try {
            service.cambiarPassword(usuario.getId(), request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada correctamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> registrar(@Valid @RequestBody UsuarioRequest request) {
        UsuarioResponse response = service.registrarUsuario(request.getNombre(), request.getEmail(), request.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listar() {
        return ResponseEntity.ok(service.listarUsuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscar(@PathVariable int id) {
        return ResponseEntity.ok(service.buscarUsuario(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (service.eliminarUsuario(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
