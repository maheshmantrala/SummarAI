package com.example.ai.service;

import org.springframework.stereotype.Service;

import com.example.ai.Aiclient.AIClient;
import com.example.ai.dto.SummarizeResponse;

@Service
public class SummarizeService {

	private final AIClient aiClient;
	public SummarizeService(AIClient aiClient) {
        this.aiClient = aiClient;
    }
	public SummarizeResponse summarize(String text) {
		String summary =aiClient.generateSummary(text);
        return new SummarizeResponse(summary );
    }
};