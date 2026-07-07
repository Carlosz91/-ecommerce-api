package com.tuapi.dto.response;

public class DetallePedidoResponse {
    private int id;
    private String productoNombre;
    private int cantidad;
    private double precioUnitario;
    private double subtotal;

    public DetallePedidoResponse(int id, String productoNombre, int cantidad, double precioUnitario, double subtotal) {
        this.id = id;
        this.productoNombre = productoNombre;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }

    public int getId() { return id; }
    public String getProductoNombre() { return productoNombre; }
    public int getCantidad() { return cantidad; }
    public double getPrecioUnitario() { return precioUnitario; }
    public double getSubtotal() { return subtotal; }
}
