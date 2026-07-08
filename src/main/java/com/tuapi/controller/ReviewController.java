package com.tuapi.controller;

import com.tuapi.config.security.JwtUtil;
import com.tuapi.dto.request.ReviewRequest;
import com.tuapi.dto.response.ReviewResponse;
import com.tuapi.dto.response.ReviewStatsResponse;
import com.tuapi.repository.UsuarioRepository;
import com.tuapi.service.ReviewService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/productos/{productoId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    public ReviewController(ReviewService reviewService, JwtUtil jwtUtil,
                            UsuarioRepository usuarioRepository) {
        this.reviewService = reviewService;
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> listar(@PathVariable int productoId) {
        return ResponseEntity.ok(reviewService.listarPorProducto(productoId));
    }

    @GetMapping("/stats")
    public ResponseEntity<ReviewStatsResponse> stats(@PathVariable int productoId) {
        return ResponseEntity.ok(reviewService.estadisticas(productoId));
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> crear(@PathVariable int productoId,
                                                @Valid @RequestBody ReviewRequest request,
                                                @RequestHeader("Authorization") String auth) {
        String email = jwtUtil.extraerEmail(auth.substring(7));
        int usuarioId = usuarioRepository.findByEmail(email).orElseThrow().getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.crear(productoId, usuarioId, request.getCalificacion(), request.getComentario()));
    }
}
