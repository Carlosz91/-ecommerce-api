package com.tuapi.service;

import com.tuapi.dto.response.DetallePedidoResponse;
import com.tuapi.dto.response.PedidoResponse;
import com.tuapi.mapper.PedidoMapper;
import com.tuapi.model.DetallePedido;
import com.tuapi.model.ItemCarrito;
import com.tuapi.model.Pedido;
import com.tuapi.repository.DetallePedidoRepository;
import com.tuapi.repository.PedidoRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PedidoService {

    private final PedidoRepository repository;
    private final DetallePedidoRepository detalleRepository;
    private final ProductoService productoService;
    private final ClienteService clienteService;
    private final DetallePedidoService detalleService;

    public PedidoService(PedidoRepository repository, DetallePedidoRepository detalleRepository,
                         ProductoService productoService, ClienteService clienteService,
                         DetallePedidoService detalleService) {
        this.repository = repository;
        this.detalleRepository = detalleRepository;
        this.productoService = productoService;
        this.clienteService = clienteService;
        this.detalleService = detalleService;
    }

    public PedidoResponse registrarPedido(int clienteId, LocalDate fecha) {
        var cliente = clienteService.buscarClienteEntity(clienteId);
        Pedido entity = repository.save(new Pedido(0, clienteId, fecha, 0));
        return PedidoMapper.toResponse(entity, cliente.getNombre());
    }

    public void agregarDetalleAPedido(int pedidoId, int productoId, int cantidad, double precioUnitario) {
        buscarPedidoEntity(pedidoId);
        detalleService.agregarDetalle(pedidoId, productoId, cantidad, precioUnitario);
        actualizarTotal(pedidoId);
    }

    private void actualizarTotal(int pedidoId) {
        Pedido pedido = buscarPedidoEntity(pedidoId);
        double total = detalleService.listarPorPedido(pedidoId).stream()
                .mapToDouble(DetallePedidoResponse::getSubtotal)
                .sum();
        pedido.setTotal(total);
        repository.save(pedido);
    }

    public Pedido confirmarPedido(int clienteId, List<ItemCarrito> items) {
        clienteService.buscarClienteEntity(clienteId);
        Pedido pedido = repository.save(new Pedido(0, clienteId, LocalDate.now(), 0));
        int detalleId = 1;
        for (ItemCarrito item : items) {
            var producto = productoService.buscarProductoEntity(item.getProductoId());
            productoService.descontarStock(item.getProductoId(), item.getCantidad());
            detalleRepository.save(new DetallePedido(detalleId++, pedido.getId(),
                    item.getProductoId(), item.getCantidad(), producto.getPrecio()));
        }
        actualizarTotal(pedido.getId());
        return repository.findById(pedido.getId()).orElseThrow();
    }

    public List<PedidoResponse> listarPedidos() {
        return repository.findAll().stream()
                .map(p -> PedidoMapper.toResponse(p,
                        clienteService.buscarClienteEntity(p.getClienteId()).getNombre()))
                .toList();
    }

    public PedidoResponse buscarPedido(int id) {
        Pedido entity = buscarPedidoEntity(id);
        var cliente = clienteService.buscarClienteEntity(entity.getClienteId());
        return PedidoMapper.toResponse(entity, cliente.getNombre());
    }

    public Pedido buscarPedidoEntity(int id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado"));
    }

    public boolean eliminarPedido(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
