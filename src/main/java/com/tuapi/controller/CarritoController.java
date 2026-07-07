package com.tuapi.controller;

import com.tuapi.dto.request.AgregarItemRequest;
import com.tuapi.dto.response.CarritoResponse;
import com.tuapi.model.Pedido;
import com.tuapi.service.CarritoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/carrito")
public class CarritoController {

    private final CarritoService service;

    public CarritoController(CarritoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Map<String, Integer>> crear() {
        int id = service.crearCarrito();
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("carritoId", id));
    }

    @GetMapping("/{carritoId}")
    public ResponseEntity<CarritoResponse> obtener(@PathVariable int carritoId) {
        return ResponseEntity.ok(service.obtenerCarrito(carritoId));
    }

    @PostMapping("/{carritoId}/items")
    public ResponseEntity<CarritoResponse> agregarItem(@PathVariable int carritoId,
                                                        @Valid @RequestBody AgregarItemRequest request) {
        CarritoResponse response = service.agregarItem(carritoId, request.getProductoId(), request.getCantidad());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{carritoId}/items/{itemId}")
    public ResponseEntity<CarritoResponse> eliminarItem(@PathVariable int carritoId, @PathVariable int itemId) {
        return ResponseEntity.ok(service.eliminarItem(carritoId, itemId));
    }

    @PostMapping("/{carritoId}/confirmar")
    public ResponseEntity<Pedido> confirmar(@PathVariable int carritoId, @RequestBody Map<String, Integer> body) {
        Pedido pedido = service.confirmarCarrito(carritoId, body.get("clienteId"));
        return ResponseEntity.status(HttpStatus.CREATED).body(pedido);
    }

    @DeleteMapping("/{carritoId}")
    public ResponseEntity<Void> limpiar(@PathVariable int carritoId) {
        service.limpiarCarrito(carritoId);
        return ResponseEntity.noContent().build();
    }
}
