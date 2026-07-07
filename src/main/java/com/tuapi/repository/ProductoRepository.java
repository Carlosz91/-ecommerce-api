package com.tuapi.repository;

import com.tuapi.model.Producto;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findByCategoriaId(int categoriaId);
    Page<Producto> findByCategoriaId(int categoriaId, Pageable pageable);
}
