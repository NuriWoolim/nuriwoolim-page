package com.nuriwoolim.pagebackend.core.security;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${custom.cors.origins}")
    List<String> corsOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        List<String> allowedOrigins = new ArrayList<>();
        allowedOrigins.addAll(List.of("http://localhost:3000",
            "http://localhost:8080",
            "http://localhost:5500",
            "http://localhost:5173",
            "https://nuriwoolimtest.netlify.app",
            "https://nuriwoolim.n-e.kr"));
        allowedOrigins.addAll(corsOrigins);

        registry.addMapping("/**")
            .allowedOrigins(allowedOrigins.toArray(new String[0]))
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .exposedHeaders("Authorization", "authorization")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
