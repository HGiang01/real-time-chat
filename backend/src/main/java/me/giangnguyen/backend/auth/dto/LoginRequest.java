package me.giangnguyen.backend.auth.dto;

public record LoginRequest(String email, String password, boolean rememberMe) {
}
