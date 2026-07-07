package com.tuapi.mapper;

import com.tuapi.dto.request.DetallePedidoRequest;
import com.tuapi.dto.response.DetallePedidoResponse;
import com.tuapi.model.DetallePedido;

public class DetallePedidoMapper {

    public static DetallePedidoResponse toResponse(DetallePedido entity, String productoNombre) {
        return new DetallePedidoResponse(
                entity.getId(),
                productoNombre,
                entity.getCantidad(),
                entity.getPrecioUnitario(),
                entity.getSubtotal()
        );
    }

    public static DetallePedido toEntity(DetallePedidoRequest request) {
        return new DetallePedido(0, request.getPedidoId(), request.getProductoId(),
                request.getCantidad(), request.getPrecioUnitario());
    }
}
