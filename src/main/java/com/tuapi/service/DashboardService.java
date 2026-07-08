package com.tuapi.service;

import com.tuapi.dto.response.DashboardStatsResponse;
import com.tuapi.repository.CategoriaRepository;
import com.tuapi.repository.PedidoRepository;
import com.tuapi.repository.ProductoRepository;
import com.tuapi.repository.UsuarioRepository;
import java.time.LocalDate;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;

    public DashboardService(ProductoRepository productoRepository, CategoriaRepository categoriaRepository,
                            PedidoRepository pedidoRepository, UsuarioRepository usuarioRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public DashboardStatsResponse obtenerEstadisticas() {
        DashboardStatsResponse r = new DashboardStatsResponse();
        r.setTotalProductos(productoRepository.count());
        r.setTotalCategorias(categoriaRepository.count());
        r.setTotalPedidos(pedidoRepository.count());
        r.setTotalUsuarios(usuarioRepository.count());
        r.setVentasDia(pedidoRepository.sumTotalByFecha(LocalDate.now()).orElse(0.0));
        r.setVentasMes(pedidoRepository.sumTotalByFechaBetween(
                LocalDate.now().withDayOfMonth(1), LocalDate.now()).orElse(0.0));
        r.setPedidosPendientes(pedidoRepository.countByEstado("PENDIENTE"));
        r.setProductosSinStock(productoRepository.countByStock(0));
        return r;
    }
}
