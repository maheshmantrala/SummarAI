package com.example.ai.Aiclient;

public class OpenAIRequest {

    private String model;
    private String input;

    public OpenAIRequest() {
    }

    public OpenAIRequest(String model, String input) {
        this.model = model;
        this.input = input;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }
}