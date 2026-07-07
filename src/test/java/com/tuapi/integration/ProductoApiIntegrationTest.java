package com.tuapi.integration;

import com.tuapi.model.Categoria;
import com.tuapi.repository.CategoriaRepository;
import com.tuapi.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProductoApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private String token;
    private int categoriaId;
    private int testCounter = 0;

    @BeforeEach
    void setUp() throws Exception {
        usuarioRepository.deleteAll();
        categoriaRepository.deleteAll();

        Categoria cat = categoriaRepository.save(new Categoria(0, "Test"));
        categoriaId = cat.getId();

        String email = "test" + (testCounter++) + "@test.com";

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nombre\":\"Test\",\"email\":\"" + email + "\",\"password\":\"123456\"}"));

        var res = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"password\":\"123456\"}"))
                .andExpect(status().isOk())
                .andReturn();

        String json = res.getResponse().getContentAsString();
        token = objectMapper.readTree(json).get("accessToken").asText();
    }

    @Test
    void testRegistrarYListarProducto() throws Exception {
        mockMvc.perform(post("/api/v1/productos")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nombre\":\"Laptop Test\",\"precio\":1500,\"stock\":10,\"categoriaId\":" + categoriaId + "}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Laptop Test"));

        mockMvc.perform(get("/api/v1/productos")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Laptop Test"));
    }

    @Test
    void testSinTokenRetorna401() throws Exception {
        mockMvc.perform(get("/api/v1/productos"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testHealthCheck() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }
}
