package com.tuapi.service;

import com.tuapi.dto.response.ReviewResponse;
import com.tuapi.dto.response.ReviewStatsResponse;
import com.tuapi.model.Review;
import com.tuapi.model.Usuario;
import com.tuapi.repository.ReviewRepository;
import com.tuapi.repository.UsuarioRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UsuarioRepository usuarioRepository;

    public ReviewService(ReviewRepository reviewRepository, UsuarioRepository usuarioRepository) {
        this.reviewRepository = reviewRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<ReviewResponse> listarPorProducto(int productoId) {
        return reviewRepository.findByProductoIdOrderByFechaDesc(productoId).stream().map(r -> {
            ReviewResponse res = new ReviewResponse();
            res.setId(r.getId());
            res.setProductoId(r.getProductoId());
            res.setUsuarioId(r.getUsuarioId());
            res.setCalificacion(r.getCalificacion());
            res.setComentario(r.getComentario());
            res.setFecha(r.getFecha());
            res.setUsuarioNombre(usuarioRepository.findById(r.getUsuarioId())
                    .map(Usuario::getNombre).orElse("Desconocido"));
            return res;
        }).toList();
    }

    public ReviewResponse crear(int productoId, int usuarioId, int calificacion, String comentario) {
        Review r = new Review();
        r.setProductoId(productoId);
        r.setUsuarioId(usuarioId);
        r.setCalificacion(calificacion);
        r.setComentario(comentario);
        r.setFecha(LocalDateTime.now());
        r = reviewRepository.save(r);
        ReviewResponse res = new ReviewResponse();
        res.setId(r.getId());
        res.setProductoId(r.getProductoId());
        res.setUsuarioId(r.getUsuarioId());
        res.setCalificacion(r.getCalificacion());
        res.setComentario(r.getComentario());
        res.setFecha(r.getFecha());
        res.setUsuarioNombre(usuarioRepository.findById(r.getUsuarioId())
                .map(Usuario::getNombre).orElse("Desconocido"));
        return res;
    }

    public ReviewStatsResponse estadisticas(int productoId) {
        return new ReviewStatsResponse(reviewRepository.promedioCalificacion(productoId),
                reviewRepository.countByProductoId(productoId));
    }
}
