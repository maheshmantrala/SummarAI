package com.example.ai.newsConfig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GNewsConfig {

    @Value("${gnews.api.url}")
    private String apiUrl;

    @Value("${gnews.api.key}")
    private String apiKey;

    public String getApiUrl() {
        return apiUrl;
    }

    public String getApiKey() {
        return apiKey;
    }
}