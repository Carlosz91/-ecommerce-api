package com.tuapi.mapper;

import com.tuapi.dto.request.PedidoRequest;
import com.tuapi.dto.response.PedidoResponse;
import com.tuapi.model.Pedido;

public class PedidoMapper {

    public static PedidoResponse toResponse(Pedido entity, String clienteNombre) {
        return new PedidoResponse(
                entity.getId(),
                clienteNombre,
                entity.getFecha(),
                entity.getTotal()
        );
    }

    public static Pedido toEntity(PedidoRequest request) {
        return new Pedido(0, request.getClienteId(), request.getFecha(), 0);
    }
}
