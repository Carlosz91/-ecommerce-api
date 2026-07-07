package com.tuapi;

import com.tuapi.dto.response.ProductoResponse;
import com.tuapi.service.CategoriaService;
import com.tuapi.service.ProductoService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Scanner;

@Component
@Profile("dev")
public class Main implements CommandLineRunner {

    private final ProductoService productoService;
    private final CategoriaService categoriaService;

    public Main(ProductoService productoService, CategoriaService categoriaService) {
        this.productoService = productoService;
        this.categoriaService = categoriaService;
    }

    @Override
    public void run(String... args) {
        Scanner scanner = new Scanner(System.in);
        int opcion;

        System.out.println("=== SISTEMA DE GESTION ===");
        System.out.println("API REST: http://localhost:8080");
        System.out.println("Consola H2: http://localhost:8080/h2-console\n");

        do {
            System.out.println("\n=== GESTION DE PRODUCTOS ===");
            System.out.println("1. Registrar producto");
            System.out.println("2. Listar productos");
            System.out.println("3. Buscar producto");
            System.out.println("4. Eliminar producto");
            System.out.println("5. Salir");
            System.out.print("Opcion: ");
            opcion = scanner.nextInt();
            scanner.nextLine();

            try {
                switch (opcion) {
                    case 1:
                        System.out.print("Nombre: ");
                        String nombre = scanner.nextLine();
                        System.out.print("Precio: ");
                        double precio = scanner.nextDouble();
                        scanner.nextLine();
                        System.out.print("Stock: ");
                        int stock = scanner.nextInt();
                        scanner.nextLine();
                        System.out.print("ID Categoria: ");
                        int categoriaId = scanner.nextInt();
                        scanner.nextLine();
                        ProductoResponse creado = productoService.registrarProducto(nombre, precio, stock, categoriaId);
                        System.out.println("Producto registrado! ID=" + creado.getId());
                        break;

                    case 2:
                        List<ProductoResponse> lista = productoService.listarProductos();
                        if (lista.isEmpty()) {
                            System.out.println("No hay productos.");
                        } else {
                            for (ProductoResponse p : lista) {
                                System.out.printf("ID: %d | %s | $%.2f | Stock: %d | %s%n",
                                        p.getId(), p.getNombre(), p.getPrecio(), p.getStock(), p.getCategoriaNombre());
                            }
                        }
                        break;

                    case 3:
                        System.out.print("ID a buscar: ");
                        int idBuscar = scanner.nextInt();
                        scanner.nextLine();
                        ProductoResponse encontrado = productoService.buscarProducto(idBuscar);
                        System.out.printf("ID: %d | %s | $%.2f | Stock: %d | %s%n",
                                encontrado.getId(), encontrado.getNombre(),
                                encontrado.getPrecio(), encontrado.getStock(), encontrado.getCategoriaNombre());
                        break;

                    case 4:
                        System.out.print("ID a eliminar: ");
                        int idEliminar = scanner.nextInt();
                        scanner.nextLine();
                        if (productoService.eliminarProducto(idEliminar)) {
                            System.out.println("Producto eliminado.");
                        } else {
                            System.out.println("No se encontro el producto.");
                        }
                        break;

                    case 5:
                        System.out.println("Hasta luego!");
                        break;

                    default:
                        System.out.println("Opcion invalida.");
                }
            } catch (IllegalArgumentException e) {
                System.out.println("Error: " + e.getMessage());
            }
        } while (opcion != 5);

        scanner.close();
    }
}
