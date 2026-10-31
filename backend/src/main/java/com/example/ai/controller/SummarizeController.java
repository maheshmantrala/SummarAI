package com.example.ai.controller;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ai.dto.SummarizeRequest;
import com.example.ai.dto.SummarizeResponse;
import com.example.ai.service.SummarizeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class SummarizeController {
	
	private final SummarizeService summarizeService;
	@Value("${app.name}")
	private String appName;
	//constructor injection
    public SummarizeController(SummarizeService summarizeService) {
        this.summarizeService = summarizeService;
    }

    @PostMapping("/summarize")
    public SummarizeResponse summarize(@Valid @RequestBody SummarizeRequest request) {

        return summarizeService.summarize(appName+ " - " + request.getText());
    }
}
