package com.tuapi.service;

import com.tuapi.dto.response.ClienteResponse;
import com.tuapi.mapper.ClienteMapper;
import com.tuapi.model.Cliente;
import com.tuapi.repository.ClienteRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public ClienteResponse registrarCliente(String nombre, String email, String telefono) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre no puede estar vacio");
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Email invalido");
        }
        Cliente entity = repository.save(new Cliente(0, nombre, email, telefono));
        return ClienteMapper.toResponse(entity);
    }

    public List<ClienteResponse> listarClientes() {
        return repository.findAll().stream()
                .map(ClienteMapper::toResponse)
                .toList();
    }

    public ClienteResponse buscarCliente(int id) {
        Cliente entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));
        return ClienteMapper.toResponse(entity);
    }

    public Cliente buscarClienteEntity(int id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));
    }

    public boolean eliminarCliente(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
