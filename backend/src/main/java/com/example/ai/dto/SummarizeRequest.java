package com.example.ai.dto;

import jakarta.validation.constraints.NotBlank;

public class SummarizeRequest {
	@NotBlank(message = "Text must not be blank")
    private String text;

    public SummarizeRequest() {
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}