package com.tuapi.config;

import com.tuapi.model.*;
import com.tuapi.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    public DataSeeder(CategoriaRepository categoriaRepository, ProductoRepository productoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    public void run(String... args) {
        if (categoriaRepository.count() > 0) return;

        Categoria electronica = categoriaRepository.save(new Categoria(0, "Electr\u00f3nica", "Dispositivos electr\u00f3nicos y accesorios"));
        Categoria ropa = categoriaRepository.save(new Categoria(0, "Ropa", "Prendas de vestir y moda"));
        Categoria hogar = categoriaRepository.save(new Categoria(0, "Hogar", "Art\u00edculos para el hogar"));

        productoRepository.save(new Producto(0, "Smartphone Pro", "Tel\u00e9fono inteligente de \u00faltima generaci\u00f3n", 1200.0, 15, electronica.getId()));
        productoRepository.save(new Producto(0, "Auriculares Bluetooth", "Auriculares inal\u00e1mbricos con cancelaci\u00f3n de ruido", 180.0, 30, electronica.getId()));
        productoRepository.save(new Producto(0, "Tablet 10 pulgadas", "Tablet para trabajo y entretenimiento", 450.0, 10, electronica.getId()));
        productoRepository.save(new Producto(0, "Reloj inteligente", "Smartwatch con monitoreo de salud", 250.0, 20, electronica.getId()));

        productoRepository.save(new Producto(0, "Camiseta Algod\u00f3n", "Camiseta de algod\u00f3n 100%", 25.0, 50, ropa.getId()));
        productoRepository.save(new Producto(0, "Jeans Cl\u00e1sicos", "Jeans de corte cl\u00e1sico", 55.0, 35, ropa.getId()));
        productoRepository.save(new Producto(0, "Chaqueta Impermeable", "Chaqueta para lluvia y viento", 89.0, 20, ropa.getId()));

        productoRepository.save(new Producto(0, "L\u00e1mpara LED", "L\u00e1mpara de escritorio LED regulable", 45.0, 25, hogar.getId()));
        productoRepository.save(new Producto(0, "Set de Sartenes", "Juego de 3 sartenes antiadherentes", 65.0, 15, hogar.getId()));
        productoRepository.save(new Producto(0, "Organizador Escritorio", "Organizador de escritorio de bamb\u00fa", 35.0, 40, hogar.getId()));
    }
}
