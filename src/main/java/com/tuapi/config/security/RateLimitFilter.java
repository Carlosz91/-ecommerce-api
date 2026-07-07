package com.tuapi.config.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Order(1)
public class RateLimitFilter implements Filter {

    private final Map<String, RateLimit> clientes = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS = 100;
    private static final long WINDOW_MS = 60000;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        String ip = request.getRemoteAddr();
        RateLimit limit = clientes.computeIfAbsent(ip, k -> new RateLimit());

        synchronized (limit) {
            long now = System.currentTimeMillis();
            if (now - limit.ventanaInicio > WINDOW_MS) {
                limit.ventanaInicio = now;
                limit.contador.set(0);
            }
            if (limit.contador.incrementAndGet() > MAX_REQUESTS) {
                HttpServletResponse resp = (HttpServletResponse) response;
                resp.setStatus(429);
                resp.setContentType("application/json");
                resp.getWriter().write("{\"status\":429,\"message\":\"Demasiadas solicitudes. Intenta en 1 minuto.\"}");
                return;
            }
        }
        chain.doFilter(request, response);
    }

    private static class RateLimit {
        long ventanaInicio = System.currentTimeMillis();
        AtomicInteger contador = new AtomicInteger(0);
    }
}
