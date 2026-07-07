package com.tuapi.service;

import com.tuapi.dto.response.ProveedorResponse;
import com.tuapi.mapper.ProveedorMapper;
import com.tuapi.model.Proveedor;
import com.tuapi.repository.ProveedorRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProveedorService {

    private final ProveedorRepository repository;

    public ProveedorService(ProveedorRepository repository) {
        this.repository = repository;
    }

    public ProveedorResponse registrarProveedor(String nombre, String contacto, String telefono) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre no puede estar vacio");
        }
        Proveedor entity = repository.save(new Proveedor(0, nombre, contacto, telefono));
        return ProveedorMapper.toResponse(entity);
    }

    public List<ProveedorResponse> listarProveedores() {
        return repository.findAll().stream()
                .map(ProveedorMapper::toResponse)
                .toList();
    }

    public ProveedorResponse buscarProveedor(int id) {
        Proveedor entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Proveedor no encontrado"));
        return ProveedorMapper.toResponse(entity);
    }

    public boolean eliminarProveedor(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
