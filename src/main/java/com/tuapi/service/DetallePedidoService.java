package com.tuapi.service;

import com.tuapi.dto.response.DetallePedidoResponse;
import com.tuapi.mapper.DetallePedidoMapper;
import com.tuapi.model.DetallePedido;
import com.tuapi.repository.DetallePedidoRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DetallePedidoService {

    private final DetallePedidoRepository repository;
    private final ProductoService productoService;

    public DetallePedidoService(DetallePedidoRepository repository, ProductoService productoService) {
        this.repository = repository;
        this.productoService = productoService;
    }

    public DetallePedidoResponse agregarDetalle(int pedidoId, int productoId, int cantidad, double precioUnitario) {
        var producto = productoService.buscarProductoEntity(productoId);
        productoService.descontarStock(productoId, cantidad);
        DetallePedido entity = repository.save(new DetallePedido(0, pedidoId, productoId, cantidad, precioUnitario));
        return DetallePedidoMapper.toResponse(entity, producto.getNombre());
    }

    public List<DetallePedidoResponse> listarDetalles() {
        return repository.findAll().stream()
                .map(d -> DetallePedidoMapper.toResponse(d,
                        productoService.buscarProductoEntity(d.getProductoId()).getNombre()))
                .toList();
    }

    public DetallePedidoResponse buscarDetalle(int id) {
        DetallePedido entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Detalle no encontrado"));
        var producto = productoService.buscarProductoEntity(entity.getProductoId());
        return DetallePedidoMapper.toResponse(entity, producto.getNombre());
    }

    public List<DetallePedidoResponse> listarPorPedido(int pedidoId) {
        return repository.findByPedidoId(pedidoId).stream()
                .map(d -> DetallePedidoMapper.toResponse(d,
                        productoService.buscarProductoEntity(d.getProductoId()).getNombre()))
                .toList();
    }

    public boolean eliminarDetalle(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
