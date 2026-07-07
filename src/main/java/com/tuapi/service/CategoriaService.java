package com.tuapi.service;

import com.tuapi.dto.response.CategoriaResponse;
import com.tuapi.mapper.CategoriaMapper;
import com.tuapi.model.Categoria;
import com.tuapi.repository.CategoriaRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    public CategoriaResponse registrarCategoria(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre no puede estar vacio");
        }
        Categoria entity = repository.save(new Categoria(0, nombre));
        return CategoriaMapper.toResponse(entity);
    }

    public List<CategoriaResponse> listarCategorias() {
        return repository.findAll().stream()
                .map(CategoriaMapper::toResponse)
                .toList();
    }

    public CategoriaResponse buscarCategoria(int id) {
        Categoria entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria no encontrada"));
        return CategoriaMapper.toResponse(entity);
    }

    public CategoriaResponse actualizarCategoria(int id, String nombre) {
        Categoria entity = buscarCategoriaEntity(id);
        entity.setNombre(nombre);
        repository.save(entity);
        return CategoriaMapper.toResponse(entity);
    }

    public Categoria buscarCategoriaEntity(int id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria no encontrada"));
    }

    public boolean eliminarCategoria(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
