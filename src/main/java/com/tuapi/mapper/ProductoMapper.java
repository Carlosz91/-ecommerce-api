package com.tuapi.mapper;

import com.tuapi.dto.request.ProductoRequest;
import com.tuapi.dto.response.ProductoResponse;
import com.tuapi.model.Producto;

public class ProductoMapper {

    public static ProductoResponse toResponse(Producto entity, String categoriaNombre) {
        return new ProductoResponse(
                entity.getId(),
                entity.getNombre(),
                entity.getDescripcion(),
                entity.getPrecio(),
                entity.getStock(),
                categoriaNombre
        );
    }

    public static Producto toEntity(ProductoRequest request) {
        return new Producto(0, request.getNombre(), request.getDescripcion(), request.getPrecio(), request.getStock(), request.getCategoriaId());
    }
}
