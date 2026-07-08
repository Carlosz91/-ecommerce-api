package com.tuapi.mapper;

import com.tuapi.dto.request.ProductoRequest;
import com.tuapi.dto.response.ProductoResponse;
import com.tuapi.model.Producto;

public class ProductoMapper {

    public static ProductoResponse toResponse(Producto entity, String categoriaNombre) {
        ProductoResponse response = new ProductoResponse(
                entity.getId(),
                entity.getNombre(),
                entity.getDescripcion(),
                entity.getPrecio(),
                entity.getStock(),
                categoriaNombre
        );
        response.setImagenUrl(entity.getImagenUrl());
        response.setDestacado(entity.isDestacado());
        response.setDescuento(entity.getDescuento());
        response.setPrecioOriginal(entity.getPrecioOriginal());
        response.setMarca(entity.getMarca());
        return response;
    }

    public static Producto toEntity(ProductoRequest request) {
        Producto producto = new Producto(0, request.getNombre(), request.getDescripcion(), request.getPrecio(), request.getStock(), request.getCategoriaId());
        producto.setImagenUrl(request.getImagenUrl());
        producto.setDestacado(request.isDestacado());
        producto.setDescuento(request.getDescuento());
        producto.setPrecioOriginal(request.getPrecioOriginal());
        producto.setMarca(request.getMarca());
        return producto;
    }
}
