package com.tuapi.controller;

import com.tuapi.dto.request.ProveedorRequest;
import com.tuapi.dto.response.ProveedorResponse;
import jakarta.validation.Valid;
import com.tuapi.service.ProveedorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/proveedores")
public class ProveedorController {

    private final ProveedorService service;

    public ProveedorController(ProveedorService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ProveedorResponse> registrar(@Valid @RequestBody ProveedorRequest request) {
        ProveedorResponse response = service.registrarProveedor(request.getNombre(), request.getContacto(), request.getTelefono());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProveedorResponse>> listar() {
        return ResponseEntity.ok(service.listarProveedores());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProveedorResponse> buscar(@PathVariable int id) {
        return ResponseEntity.ok(service.buscarProveedor(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (service.eliminarProveedor(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
