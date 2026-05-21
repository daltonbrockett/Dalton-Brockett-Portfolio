package com.dalton.analytics.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS configuration to allow the React frontend (running on a different port
 * in development) to make API calls to this Spring Boot server.
 *
 * In development: Vite runs on :5173, Spring Boot on :8080
 * In production: Frontend on Vercel, API on Railway (different domains)
 */
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(
                        "http://localhost:5173",   // Vite dev server
                        "http://localhost:3000",   // Alternative dev port
                        "https://*.vercel.app"     // Production Vercel
                    )
                    .allowedMethods("GET", "POST", "PATCH", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(false);
            }
        };
    }
}
