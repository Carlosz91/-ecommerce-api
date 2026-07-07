package com.tuapi.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class PedidoRequest {

    @Positive(message = "El cliente es obligatorio")
    private int clienteId;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    public int getClienteId() { return clienteId; }
    public void setClienteId(int clienteId) { this.clienteId = clienteId; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
}
