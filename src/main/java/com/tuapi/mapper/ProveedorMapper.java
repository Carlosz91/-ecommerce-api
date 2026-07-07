package com.tuapi.mapper;

import com.tuapi.dto.request.ProveedorRequest;
import com.tuapi.dto.response.ProveedorResponse;
import com.tuapi.model.Proveedor;

public class ProveedorMapper {

    public static ProveedorResponse toResponse(Proveedor entity) {
        return new ProveedorResponse(entity.getId(), entity.getNombre(), entity.getContacto(), entity.getTelefono());
    }

    public static Proveedor toEntity(ProveedorRequest request) {
        return new Proveedor(0, request.getNombre(), request.getContacto(), request.getTelefono());
    }
}
