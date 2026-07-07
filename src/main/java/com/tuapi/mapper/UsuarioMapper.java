package com.tuapi.mapper;

import com.tuapi.dto.request.UsuarioRequest;
import com.tuapi.dto.response.UsuarioResponse;
import com.tuapi.model.Rol;
import com.tuapi.model.Usuario;

public class UsuarioMapper {

    public static UsuarioResponse toResponse(Usuario entity) {
        return new UsuarioResponse(entity.getId(), entity.getNombre(), entity.getEmail(), entity.getRol().name());
    }

    public static Usuario toEntity(UsuarioRequest request) {
        return new Usuario(0, request.getNombre(), request.getEmail(), request.getPassword(), Rol.USER);
    }
}
