package me.giangnguyen.backend.auth.dto;

public record OAuth2LoginRequest(String email, String username, String provider, String providerUserId) {
}
