# E-Commerce API

API REST para e-commerce desarrollada con Spring Boot 3.4 + Java 21. Incluye autenticación JWT, control de stock, carrito de compras, roles de usuario y despliegue con Docker.

## Stack

- **Java 21** · **Spring Boot 3.4.4** · **Spring Security** · **JPA/Hibernate**
- **H2** (dev) · **MySQL** (prod)
- **JWT** (access + refresh tokens) · **BCrypt**
- **Swagger/OpenAPI** · **JUnit + Mockito**
- **Docker** · **Docker Compose**

## Funcionalidades

- CRUD completo: Categorías, Productos, Clientes, Proveedores, Usuarios
- Carrito de compras con items
- Pedidos con detalle y control de stock
- Paginación en listado de productos
- Autenticación JWT (access 1h + refresh 7d)
- Roles: ADMIN y USER
- Bloqueo por fuerza bruta (5 intentos → 15 min)
- Logout con invalidación de token
- Rate limiting (100 req/min/IP)
- HTTPS con redirect automático (8080 → 8443)
- Perfiles: `default` (H2), `mysql` (producción), `dev` (CLI)
- Internacionalización lista para español/inglés
- Swagger UI con botón Authorize

## Endpoints

### Públicos
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Registro de usuario |
| POST | `/api/v1/auth/login` | Inicio de sesión |
| POST | `/api/v1/auth/refresh` | Renovar access token |
| POST | `/api/v1/usuarios` | Crear usuario |

### Protegidos (requieren token)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST | `/api/v1/categorias` | Listar/Crear categorías |
| GET/PUT/DELETE | `/api/v1/categorias/{id}` | CRUD categoría |
| GET/POST | `/api/v1/productos` | Listar/Crear productos |
| GET/PUT/DELETE | `/api/v1/productos/{id}` | CRUD producto |
| GET | `/api/v1/productos/page?page=0&size=10` | Paginación |
| GET/POST | `/api/v1/clientes` | Listar/Crear clientes |
| GET/PUT/DELETE | `/api/v1/clientes/{id}` | CRUD cliente |
| GET/POST | `/api/v1/proveedores` | Listar/Crear proveedores |
| GET/DELETE | `/api/v1/proveedores/{id}` | CRUD proveedor |
| POST | `/api/v1/carrito/agregar` | Agregar item al carrito |
| DELETE | `/api/v1/carrito/eliminar/{itemId}` | Quitar item |
| DELETE | `/api/v1/carrito/vaciar/{carritoId}` | Vaciar carrito |
| GET | `/api/v1/carrito/{id}` | Ver carrito |
| POST | `/api/v1/pedidos` | Crear pedido desde carrito |
| GET | `/api/v1/pedidos` | Listar pedidos |
| GET | `/api/v1/pedidos/{id}` | Ver pedido con detalle |
| POST | `/api/v1/auth/logout` | Cerrar sesión |

### Solo ADMIN
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/admin/health` | Health check |
| POST | `/api/v1/admin/unlock/{email}` | Desbloquear usuario |

## Cómo ejecutar

### Con Maven (desarrollo)
```bash
# Linux/macOS
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

### Con Docker (producción con MySQL)
```bash
docker-compose up --build
```

Acceder a Swagger UI: https://localhost:8443/swagger-ui/index.html

## Perfiles

| Perfil | Base de datos | Puerto | SSL |
|--------|--------------|--------|-----|
| `default` | H2 (memoria) | 8443 | ✅ |
| `mysql` | MySQL (Docker) | 8443 | ✅ |
| `dev` | H2 + CLI interactiva | 8443 | ✅ |

```bash
# Perfil MySQL
mvn spring-boot:run -Dspring-boot.run.profiles=mysql

# Perfil dev (CLI)
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## Tests

```bash
mvn test
```

## Variables de entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `DB_URL` | URL de base de datos MySQL | `jdbc:mysql://localhost:3306/ecommerce` |
| `DB_USER` | Usuario MySQL | `root` |
| `DB_PASS` | Contraseña MySQL | `root` |
| `JWT_SECRET` | Secreto para firmar JWT | Configurado en properties |

## Licencia

MIT
