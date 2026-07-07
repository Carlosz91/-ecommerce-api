package com.tuapi.dto.response;

public class TokenResponse {
    private String accessToken;
    private String refreshToken;
    private String tipo;
    private String rol;

    public TokenResponse(String accessToken, String refreshToken, String rol) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tipo = "Bearer";
        this.rol = rol;
    }

    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public String getTipo() { return tipo; }
    public String getRol() { return rol; }
}
