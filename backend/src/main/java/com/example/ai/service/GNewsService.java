package com.example.ai.service;



import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.ai.dto.GNewsResponse;
import com.example.ai.newsConfig.GNewsConfig;

@Service
public class GNewsService {

    private final RestClient restClient;
    private final GNewsConfig gNewsConfig;

    public GNewsService(GNewsConfig gNewsConfig) {
        this.restClient = RestClient.create();
        this.gNewsConfig = gNewsConfig;
    }

    public GNewsResponse fetchTechnologyNews() {

        String url = UriComponentsBuilder
                .fromUriString(gNewsConfig.getApiUrl() + "/search")
                .queryParam("q", "technology")
                .queryParam("lang", "en")
                .queryParam("max", 10)
                .queryParam("apikey", gNewsConfig.getApiKey())
                .build()
                .encode()
                .toUriString();

        return restClient.get()
                .uri(url)
                .retrieve()
                .body(GNewsResponse.class);
    }
}
