package com.tuapi.mapper;

import com.tuapi.dto.request.CategoriaRequest;
import com.tuapi.dto.response.CategoriaResponse;
import com.tuapi.model.Categoria;

public class CategoriaMapper {

    public static CategoriaResponse toResponse(Categoria entity) {
        return new CategoriaResponse(entity.getId(), entity.getNombre());
    }

    public static Categoria toEntity(CategoriaRequest request) {
        return new Categoria(0, request.getNombre());
    }
}
