package com.tuapi.dto.request;

import jakarta.validation.constraints.Positive;

public class AgregarItemRequest {

    @Positive(message = "El producto es obligatorio")
    private int productoId;

    @Positive(message = "La cantidad debe ser mayor a 0")
    private int cantidad;

    public int getProductoId() { return productoId; }
    public void setProductoId(int productoId) { this.productoId = productoId; }
    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
}
