package com.tuapi.dto.response;

import java.time.LocalDate;

public class PedidoResponse {
    private int id;
    private String clienteNombre;
    private LocalDate fecha;
    private double total;

    public PedidoResponse(int id, String clienteNombre, LocalDate fecha, double total) {
        this.id = id;
        this.clienteNombre = clienteNombre;
        this.fecha = fecha;
        this.total = total;
    }

    public int getId() { return id; }
    public String getClienteNombre() { return clienteNombre; }
    public LocalDate getFecha() { return fecha; }
    public double getTotal() { return total; }
}
