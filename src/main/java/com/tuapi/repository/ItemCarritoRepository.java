package com.tuapi.repository;

import com.tuapi.model.ItemCarrito;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Integer> {
    List<ItemCarrito> findByCarritoId(int carritoId);

    @Modifying
    @Transactional
    @Query("DELETE FROM ItemCarrito i WHERE i.carritoId = ?1")
    void deleteByCarritoId(int carritoId);
}
