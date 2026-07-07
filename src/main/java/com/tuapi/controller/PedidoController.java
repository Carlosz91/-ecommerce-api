package com.tuapi.controller;

import com.tuapi.dto.request.DetallePedidoRequest;
import com.tuapi.dto.request.PedidoRequest;
import com.tuapi.dto.response.PedidoResponse;
import jakarta.validation.Valid;
import com.tuapi.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pedidos")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PedidoResponse> registrar(@Valid @RequestBody PedidoRequest request) {
        PedidoResponse response = service.registrarPedido(request.getClienteId(), request.getFecha());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{pedidoId}/detalles")
    public ResponseEntity<Void> agregarDetalle(@PathVariable int pedidoId, @Valid @RequestBody DetallePedidoRequest request) {
        service.agregarDetalleAPedido(pedidoId, request.getProductoId(), request.getCantidad(), request.getPrecioUnitario());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> listar() {
        return ResponseEntity.ok(service.listarPedidos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> buscar(@PathVariable int id) {
        return ResponseEntity.ok(service.buscarPedido(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (service.eliminarPedido(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
