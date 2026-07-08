package com.tuapi.controller;

import com.tuapi.config.security.JwtUtil;
import com.tuapi.dto.response.WishlistResponse;
import com.tuapi.repository.UsuarioRepository;
import com.tuapi.service.WishlistService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    public WishlistController(WishlistService wishlistService, JwtUtil jwtUtil,
                              UsuarioRepository usuarioRepository) {
        this.wishlistService = wishlistService;
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<List<WishlistResponse>> listar(@RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(wishlistService.listarWishlist(extraerUsuarioId(auth)));
    }

    @PostMapping("/{productoId}")
    public ResponseEntity<WishlistResponse> agregar(@RequestHeader("Authorization") String auth,
                                                    @PathVariable int productoId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(wishlistService.agregar(extraerUsuarioId(auth), productoId));
    }

    @DeleteMapping("/{productoId}")
    public ResponseEntity<Void> eliminar(@RequestHeader("Authorization") String auth,
                                         @PathVariable int productoId) {
        wishlistService.eliminar(extraerUsuarioId(auth), productoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/{productoId}")
    public ResponseEntity<Map<String, Boolean>> check(@RequestHeader("Authorization") String auth,
                                                      @PathVariable int productoId) {
        boolean existe = wishlistService.existe(extraerUsuarioId(auth), productoId);
        return ResponseEntity.ok(Map.of("existe", existe));
    }

    private int extraerUsuarioId(String auth) {
        String email = jwtUtil.extraerEmail(auth.substring(7));
        return usuarioRepository.findByEmail(email).orElseThrow().getId();
    }
}
