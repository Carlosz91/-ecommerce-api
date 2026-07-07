package com.tuapi.controller;

import com.tuapi.dto.request.DetallePedidoRequest;
import com.tuapi.dto.response.DetallePedidoResponse;
import jakarta.validation.Valid;
import com.tuapi.service.DetallePedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/detalles-pedido")
public class DetallePedidoController {

    private final DetallePedidoService service;

    public DetallePedidoController(DetallePedidoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<DetallePedidoResponse> agregar(@Valid @RequestBody DetallePedidoRequest request) {
        DetallePedidoResponse response = service.agregarDetalle(
                request.getPedidoId(), request.getProductoId(), request.getCantidad(), request.getPrecioUnitario());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<DetallePedidoResponse>> listar() {
        return ResponseEntity.ok(service.listarDetalles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetallePedidoResponse> buscar(@PathVariable int id) {
        return ResponseEntity.ok(service.buscarDetalle(id));
    }

    @GetMapping("/pedido/{pedidoId}")
    public ResponseEntity<List<DetallePedidoResponse>> listarPorPedido(@PathVariable int pedidoId) {
        return ResponseEntity.ok(service.listarPorPedido(pedidoId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (service.eliminarDetalle(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
