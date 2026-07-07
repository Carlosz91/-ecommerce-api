package com.tuapi.repository;

import com.tuapi.model.ItemCarrito;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Integer> {
    List<ItemCarrito> findByCarritoId(int carritoId);
    void deleteByCarritoId(int carritoId);
}
