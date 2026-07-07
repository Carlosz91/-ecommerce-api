package com.tuapi.dto.request;

import jakarta.validation.constraints.Positive;

public class DetallePedidoRequest {

    @Positive(message = "El pedido es obligatorio")
    private int pedidoId;

    @Positive(message = "El producto es obligatorio")
    private int productoId;

    @Positive(message = "La cantidad debe ser mayor a 0")
    private int cantidad;

    @Positive(message = "El precio debe ser mayor a 0")
    private double precioUnitario;

    public int getPedidoId() { return pedidoId; }
    public void setPedidoId(int pedidoId) { this.pedidoId = pedidoId; }
    public int getProductoId() { return productoId; }
    public void setProductoId(int productoId) { this.productoId = productoId; }
    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
    public double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(double precioUnitario) { this.precioUnitario = precioUnitario; }
}
