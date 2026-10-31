package com.example.ai.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ai.dto.GNewsResponse;
import com.example.ai.service.GNewsService;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final GNewsService gNewsService;

    public NewsController(GNewsService gNewsService) {
        this.gNewsService = gNewsService;
    }

    @GetMapping("/technology")
    public GNewsResponse getTechnologyNews() {
        return gNewsService.fetchTechnologyNews();
    }
}
