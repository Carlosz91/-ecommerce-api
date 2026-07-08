package com.tuapi.repository;

import com.tuapi.model.Pedido;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE p.fecha = ?1")
    Optional<Double> sumTotalByFecha(LocalDate fecha);

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE p.fecha BETWEEN ?1 AND ?2")
    Optional<Double> sumTotalByFechaBetween(LocalDate start, LocalDate end);

    long countByEstado(String estado);
}
