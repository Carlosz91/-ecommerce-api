package com.tuapi.repository;
import com.tuapi.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    List<Wishlist> findByUsuarioId(int usuarioId);
    Optional<Wishlist> findByUsuarioIdAndProductoId(int usuarioId, int productoId);
    void deleteByUsuarioIdAndProductoId(int usuarioId, int productoId);
    boolean existsByUsuarioIdAndProductoId(int usuarioId, int productoId);
}
