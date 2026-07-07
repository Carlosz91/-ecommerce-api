package com.tuapi.mapper;

import com.tuapi.dto.request.ClienteRequest;
import com.tuapi.dto.response.ClienteResponse;
import com.tuapi.model.Cliente;

public class ClienteMapper {

    public static ClienteResponse toResponse(Cliente entity) {
        return new ClienteResponse(entity.getId(), entity.getNombre(), entity.getEmail(), entity.getTelefono());
    }

    public static Cliente toEntity(ClienteRequest request) {
        return new Cliente(0, request.getNombre(), request.getEmail(), request.getTelefono());
    }
}
