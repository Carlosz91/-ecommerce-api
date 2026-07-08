package com.tuapi.repository;
import com.tuapi.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByProductoIdOrderByFechaDesc(int productoId);
    @Query("SELECT COALESCE(AVG(r.calificacion), 0) FROM Review r WHERE r.productoId = ?1")
    double promedioCalificacion(int productoId);
    int countByProductoId(int productoId);
}
