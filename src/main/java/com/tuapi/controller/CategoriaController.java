package com.tuapi.controller;

import com.tuapi.dto.request.ActualizarCategoriaRequest;
import com.tuapi.dto.request.CategoriaRequest;
import com.tuapi.dto.response.CategoriaResponse;
import jakarta.validation.Valid;
import com.tuapi.service.CategoriaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias")
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CategoriaResponse> registrar(@Valid @RequestBody CategoriaRequest request) {
        CategoriaResponse response = service.registrarCategoria(request.getNombre());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listar() {
        return ResponseEntity.ok(service.listarCategorias());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponse> buscar(@PathVariable int id) {
        return ResponseEntity.ok(service.buscarCategoria(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> actualizar(@PathVariable int id,
                                                         @Valid @RequestBody ActualizarCategoriaRequest request) {
        return ResponseEntity.ok(service.actualizarCategoria(id, request.getNombre()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (service.eliminarCategoria(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
