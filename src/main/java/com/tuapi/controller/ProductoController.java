package com.tuapi.controller;

import com.tuapi.dto.request.ActualizarProductoRequest;
import com.tuapi.dto.request.ProductoRequest;
import com.tuapi.dto.response.ProductoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.tuapi.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ProductoResponse> registrar(@Valid @RequestBody ProductoRequest request) {
        ProductoResponse response = service.registrarProducto(
                request.getNombre(), request.getDescripcion(), request.getPrecio(), request.getStock(), request.getCategoriaId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProductoResponse>> listar() {
        return ResponseEntity.ok(service.listarProductos());
    }

    @GetMapping("/page")
    public ResponseEntity<Page<ProductoResponse>> listarPaginado(Pageable pageable) {
        return ResponseEntity.ok(service.listarProductos(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> buscar(@PathVariable int id) {
        return ResponseEntity.ok(service.buscarProducto(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponse> actualizar(@PathVariable int id,
                                                        @Valid @RequestBody ActualizarProductoRequest request) {
        return ResponseEntity.ok(service.actualizarProducto(id, request.getNombre(),
                request.getDescripcion(), request.getPrecio(), request.getStock(), request.getCategoriaId()));
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<ProductoResponse>> listarPorCategoria(@PathVariable int categoriaId) {
        return ResponseEntity.ok(service.listarPorCategoria(categoriaId));
    }

    @PostMapping("/{id}/stock")
    public ResponseEntity<Void> agregarStock(@PathVariable int id, @RequestBody Map<String, Integer> body) {
        service.agregarStock(id, body.get("cantidad"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/stock")
    public ResponseEntity<Void> descontarStock(@PathVariable int id, @RequestBody Map<String, Integer> body) {
        service.descontarStock(id, body.get("cantidad"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (service.eliminarProducto(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
