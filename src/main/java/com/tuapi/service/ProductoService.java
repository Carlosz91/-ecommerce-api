package com.tuapi.service;

import com.tuapi.dto.response.ProductoResponse;
import com.tuapi.mapper.ProductoMapper;
import com.tuapi.model.Producto;
import com.tuapi.repository.ProductoRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductoService {

    private final ProductoRepository repository;
    private final CategoriaService categoriaService;

    public ProductoService(ProductoRepository repository, CategoriaService categoriaService) {
        this.repository = repository;
        this.categoriaService = categoriaService;
    }

    public ProductoResponse registrarProducto(String nombre, String descripcion, double precio, int stock, int categoriaId) {
        var categoria = categoriaService.buscarCategoriaEntity(categoriaId);
        Producto entity = repository.save(new Producto(0, nombre, descripcion, precio, stock, categoriaId));
        return ProductoMapper.toResponse(entity, categoria.getNombre());
    }

    public Page<ProductoResponse> listarProductos(Pageable pageable) {
        return repository.findAll(pageable)
                .map(p -> ProductoMapper.toResponse(p,
                        categoriaService.buscarCategoriaEntity(p.getCategoriaId()).getNombre()));
    }

    public List<ProductoResponse> listarProductos() {
        return repository.findAll().stream()
                .map(p -> ProductoMapper.toResponse(p,
                        categoriaService.buscarCategoriaEntity(p.getCategoriaId()).getNombre()))
                .toList();
    }

    public List<ProductoResponse> listarDestacados() {
        return repository.findByDestacadoTrue().stream()
                .map(p -> ProductoMapper.toResponse(p,
                        categoriaService.buscarCategoriaEntity(p.getCategoriaId()).getNombre()))
                .toList();
    }

    public List<ProductoResponse> buscarPorNombre(String q) {
        return repository.findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(q, q).stream()
                .map(p -> ProductoMapper.toResponse(p,
                        categoriaService.buscarCategoriaEntity(p.getCategoriaId()).getNombre()))
                .toList();
    }

    public ProductoResponse buscarProducto(int id) {
        Producto entity = buscarProductoEntity(id);
        var categoria = categoriaService.buscarCategoriaEntity(entity.getCategoriaId());
        return ProductoMapper.toResponse(entity, categoria.getNombre());
    }

    public Producto buscarProductoEntity(int id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
    }

    public boolean eliminarProducto(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public Page<ProductoResponse> listarPorCategoria(int categoriaId, Pageable pageable) {
        var categoria = categoriaService.buscarCategoriaEntity(categoriaId);
        return repository.findByCategoriaId(categoriaId, pageable)
                .map(p -> ProductoMapper.toResponse(p, categoria.getNombre()));
    }

    public List<ProductoResponse> listarPorCategoria(int categoriaId) {
        var categoria = categoriaService.buscarCategoriaEntity(categoriaId);
        return repository.findByCategoriaId(categoriaId).stream()
                .map(p -> ProductoMapper.toResponse(p, categoria.getNombre()))
                .toList();
    }

    public ProductoResponse actualizarProducto(int id, String nombre, String descripcion, double precio, int stock, int categoriaId) {
        Producto entity = buscarProductoEntity(id);
        var categoria = categoriaService.buscarCategoriaEntity(categoriaId);
        entity.setNombre(nombre);
        entity.setDescripcion(descripcion);
        entity.setPrecio(precio);
        entity.setStock(stock);
        entity.setCategoriaId(categoriaId);
        repository.save(entity);
        return ProductoMapper.toResponse(entity, categoria.getNombre());
    }

    public void agregarStock(int id, int cantidad) {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
        }
        Producto producto = buscarProductoEntity(id);
        producto.setStock(producto.getStock() + cantidad);
        repository.save(producto);
    }

    public void descontarStock(int id, int cantidad) {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
        }
        Producto producto = buscarProductoEntity(id);
        if (producto.getStock() < cantidad) {
            throw new IllegalArgumentException("Stock insuficiente. Disponible: " + producto.getStock());
        }
        producto.setStock(producto.getStock() - cantidad);
        repository.save(producto);
    }
}
