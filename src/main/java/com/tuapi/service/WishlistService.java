package com.tuapi.service;

import com.tuapi.dto.response.WishlistResponse;
import com.tuapi.model.Categoria;
import com.tuapi.model.Producto;
import com.tuapi.model.Wishlist;
import com.tuapi.repository.CategoriaRepository;
import com.tuapi.repository.ProductoRepository;
import com.tuapi.repository.WishlistRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public WishlistService(WishlistRepository wishlistRepository, ProductoRepository productoRepository,
                           CategoriaRepository categoriaRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public List<WishlistResponse> listarWishlist(int usuarioId) {
        return wishlistRepository.findByUsuarioId(usuarioId).stream().map(w -> {
            Producto p = productoRepository.findById(w.getProductoId()).orElse(null);
            String catNombre = p != null ? categoriaRepository.findById(p.getCategoriaId())
                    .map(Categoria::getNombre).orElse("") : "";
            String img = p != null ? p.getImagenUrl() : null;
            return new WishlistResponse(w.getId(), w.getProductoId(),
                    p != null ? p.getNombre() : "",
                    p != null ? p.getPrecio() : 0, catNombre, img);
        }).toList();
    }

    public WishlistResponse agregar(int usuarioId, int productoId) {
        if (wishlistRepository.existsByUsuarioIdAndProductoId(usuarioId, productoId)) {
            throw new IllegalArgumentException("El producto ya esta en la wishlist");
        }
        Wishlist w = wishlistRepository.save(new Wishlist(0, usuarioId, productoId));
        Producto p = productoRepository.findById(productoId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
        String catNombre = categoriaRepository.findById(p.getCategoriaId())
                .map(Categoria::getNombre).orElse("");
        return new WishlistResponse(w.getId(), w.getProductoId(), p.getNombre(),
                p.getPrecio(), catNombre, p.getImagenUrl());
    }

    public void eliminar(int usuarioId, int productoId) {
        wishlistRepository.deleteByUsuarioIdAndProductoId(usuarioId, productoId);
    }

    public boolean existe(int usuarioId, int productoId) {
        return wishlistRepository.existsByUsuarioIdAndProductoId(usuarioId, productoId);
    }
}
