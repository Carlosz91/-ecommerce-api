package com.tuapi.service;

import com.tuapi.dto.response.UsuarioResponse;
import com.tuapi.mapper.UsuarioMapper;
import com.tuapi.model.Rol;
import com.tuapi.model.Usuario;
import com.tuapi.repository.UsuarioRepository;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public UsuarioResponse registrarUsuario(String nombre, String email, String password) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre no puede estar vacio");
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Email invalido");
        }
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
        }
        Usuario entity = repository.save(new Usuario(0, nombre, email, passwordEncoder.encode(password), Rol.USER));
        return UsuarioMapper.toResponse(entity);
    }

    public List<UsuarioResponse> listarUsuarios() {
        return repository.findAll().stream()
                .map(UsuarioMapper::toResponse)
                .toList();
    }

    public UsuarioResponse buscarUsuario(int id) {
        Usuario entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        return UsuarioMapper.toResponse(entity);
    }

    public boolean eliminarUsuario(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public UsuarioResponse actualizarPerfil(int id, String nombre, String telefono, String direccion) {
        Usuario entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        if (nombre != null) entity.setNombre(nombre);
        if (telefono != null) entity.setTelefono(telefono);
        if (direccion != null) entity.setDireccion(direccion);
        entity = repository.save(entity);
        UsuarioResponse response = UsuarioMapper.toResponse(entity);
        response.setTelefono(entity.getTelefono());
        response.setDireccion(entity.getDireccion());
        response.setGoogleId(entity.getGoogleId());
        response.setAvatarUrl(entity.getAvatarUrl());
        response.setEmailVerified(entity.isEmailVerified());
        return response;
    }

    public void cambiarPassword(int id, String currentPassword, String newPassword) {
        Usuario entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        if (!passwordEncoder.matches(currentPassword, entity.getPassword())) {
            throw new IllegalArgumentException("Contraseña actual incorrecta");
        }
        entity.setPassword(passwordEncoder.encode(newPassword));
        repository.save(entity);
    }

    public Usuario buscarPorEmail(String email) {
        return repository.findByEmail(email).orElse(null);
    }

    public Usuario registrarOAuthUsuario(String googleId, String nombre, String email, String avatarUrl) {
        Usuario usuario = new Usuario(0, nombre, email, "", Rol.USER);
        usuario.setGoogleId(googleId);
        usuario.setAvatarUrl(avatarUrl);
        usuario.setEmailVerified(true);
        return repository.save(usuario);
    }
}
