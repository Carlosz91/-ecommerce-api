package com.tuapi.service;

import com.tuapi.dto.response.ProductoResponse;
import com.tuapi.model.Categoria;
import com.tuapi.model.Producto;
import com.tuapi.repository.CategoriaRepository;
import com.tuapi.repository.ProductoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    private CategoriaService categoriaService;
    private ProductoService productoService;

    @BeforeEach
    void setUp() {
        categoriaService = new CategoriaService(categoriaRepository);
        productoService = new ProductoService(productoRepository, categoriaService);
    }

    @Test
    void testRegistrarProducto() {
        when(categoriaRepository.findById(1)).thenReturn(Optional.of(new Categoria(1, "Electronica")));
        when(productoRepository.save(any())).thenReturn(new Producto(1, "Laptop", 1500, 10, 1));

        ProductoResponse response = productoService.registrarProducto("Laptop", 1500, 10, 1);

        assertNotNull(response);
        assertEquals("Laptop", response.getNombre());
        assertEquals(1500, response.getPrecio());
        assertEquals(10, response.getStock());
    }

    @Test
    void testBuscarProductoNoExistenteLanzaExcepcion() {
        when(productoRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> productoService.buscarProducto(999));
    }

    @Test
    void testAgregarStock() {
        Producto producto = new Producto(1, "Laptop", 1500, 10, 1);
        when(productoRepository.findById(1)).thenReturn(Optional.of(producto));
        when(productoRepository.save(any())).thenReturn(producto);

        productoService.agregarStock(1, 5);

        assertEquals(15, producto.getStock());
    }

    @Test
    void testDescontarStockInsuficiente() {
        Producto producto = new Producto(1, "Laptop", 1500, 2, 1);
        when(productoRepository.findById(1)).thenReturn(Optional.of(producto));

        assertThrows(IllegalArgumentException.class, () -> productoService.descontarStock(1, 5));
    }
}
