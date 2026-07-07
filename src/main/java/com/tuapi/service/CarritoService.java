package com.tuapi.service;

import com.tuapi.dto.response.CarritoResponse;
import com.tuapi.dto.response.ItemCarritoResponse;
import com.tuapi.model.Carrito;
import com.tuapi.model.ItemCarrito;
import com.tuapi.model.Pedido;
import com.tuapi.repository.CarritoRepository;
import com.tuapi.repository.ItemCarritoRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final ItemCarritoRepository itemRepository;
    private final ProductoService productoService;
    private final PedidoService pedidoService;

    public CarritoService(CarritoRepository carritoRepository, ItemCarritoRepository itemRepository,
                          ProductoService productoService, PedidoService pedidoService) {
        this.carritoRepository = carritoRepository;
        this.itemRepository = itemRepository;
        this.productoService = productoService;
        this.pedidoService = pedidoService;
    }

    public int crearCarrito() {
        Carrito carrito = carritoRepository.save(new Carrito(null));
        return carrito.getId();
    }

    public CarritoResponse obtenerCarrito(int carritoId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new IllegalArgumentException("Carrito no encontrado"));
        return buildResponse(carrito);
    }

    public CarritoResponse agregarItem(int carritoId, int productoId, int cantidad) {
        carritoRepository.findById(carritoId)
                .orElseThrow(() -> new IllegalArgumentException("Carrito no encontrado"));
        productoService.buscarProductoEntity(productoId);
        itemRepository.save(new ItemCarrito(carritoId, productoId, cantidad));
        return buildResponse(carritoRepository.findById(carritoId).orElseThrow());
    }

    public CarritoResponse eliminarItem(int carritoId, int itemId) {
        ItemCarrito item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item no encontrado"));
        if (item.getCarritoId() != carritoId) {
            throw new IllegalArgumentException("El item no pertenece a este carrito");
        }
        itemRepository.deleteById(itemId);
        return buildResponse(carritoRepository.findById(carritoId).orElseThrow());
    }

    public void limpiarCarrito(int carritoId) {
        carritoRepository.findById(carritoId)
                .orElseThrow(() -> new IllegalArgumentException("Carrito no encontrado"));
        itemRepository.deleteByCarritoId(carritoId);
    }

    public Pedido confirmarCarrito(int carritoId, int clienteId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new IllegalArgumentException("Carrito no encontrado"));
        List<ItemCarrito> items = itemRepository.findByCarritoId(carritoId);
        if (items.isEmpty()) {
            throw new IllegalArgumentException("El carrito esta vacio");
        }
        Pedido pedido = pedidoService.confirmarPedido(clienteId, items);
        itemRepository.deleteByCarritoId(carritoId);
        return pedido;
    }

    private CarritoResponse buildResponse(Carrito carrito) {
        List<ItemCarrito> items = itemRepository.findByCarritoId(carrito.getId());
        List<ItemCarritoResponse> itemsResponse = new ArrayList<>();
        double total = 0;
        for (ItemCarrito item : items) {
            var producto = productoService.buscarProductoEntity(item.getProductoId());
            double subtotal = item.getSubtotal(producto.getPrecio());
            itemsResponse.add(new ItemCarritoResponse(
                    item.getId(), producto.getNombre(), item.getCantidad(), producto.getPrecio(), subtotal));
            total += subtotal;
        }
        return new CarritoResponse(carrito.getId(), itemsResponse, total);
    }
}
