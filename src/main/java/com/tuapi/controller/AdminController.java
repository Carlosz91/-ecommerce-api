package com.tuapi.controller;

import com.tuapi.config.security.LoginAttemptService;
import com.tuapi.dto.response.DashboardStatsResponse;
import com.tuapi.model.Producto;
import com.tuapi.repository.PedidoRepository;
import com.tuapi.repository.ProductoRepository;
import com.tuapi.service.DashboardService;
import com.tuapi.service.FileUploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final LoginAttemptService loginAttemptService;
    private final DashboardService dashboardService;
    private final PedidoRepository pedidoRepository;
    private final FileUploadService fileUploadService;
    private final ProductoRepository productoRepository;

    public AdminController(LoginAttemptService loginAttemptService, DashboardService dashboardService,
                           PedidoRepository pedidoRepository, FileUploadService fileUploadService,
                           ProductoRepository productoRepository) {
        this.loginAttemptService = loginAttemptService;
        this.dashboardService = dashboardService;
        this.pedidoRepository = pedidoRepository;
        this.fileUploadService = fileUploadService;
        this.productoRepository = productoRepository;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }

    @PostMapping("/unlock/{email}")
    public ResponseEntity<Void> unlockUser(@PathVariable String email) {
        loginAttemptService.loginSucceeded(email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> dashboard() {
        return ResponseEntity.ok(dashboardService.obtenerEstadisticas());
    }

    @PutMapping("/pedidos/{id}/estado")
    public ResponseEntity<Void> actualizarEstado(@PathVariable int id, @RequestBody Map<String, String> body) {
        String estado = body.get("estado");
        if (estado == null) return ResponseEntity.badRequest().build();
        pedidoRepository.findById(id).ifPresent(pedido -> {
            pedido.setEstado(estado);
            pedidoRepository.save(pedido);
        });
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pedidos/pendientes")
    public ResponseEntity<Map<String, Long>> pedidosPendientes() {
        return ResponseEntity.ok(Map.of("pendientes", pedidoRepository.countByEstado("PENDIENTE")));
    }

    @PostMapping("/productos/{id}/imagen")
    public ResponseEntity<?> subirImagen(@PathVariable int id, @RequestParam("file") MultipartFile file) {
        try {
            String imagenUrl = fileUploadService.guardarImagen(file);
            Producto producto = productoRepository.findById(id).orElse(null);
            if (producto == null) return ResponseEntity.notFound().build();
            producto.setImagenUrl(imagenUrl);
            productoRepository.save(producto);
            return ResponseEntity.ok(Map.of("imagenUrl", imagenUrl));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error al subir la imagen"));
        }
    }
}
