package com.example.ai.Aiclient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class OpenAIClient implements AIClient {

    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public OpenAIClient(
            @Value("${openai.api.url}") String apiUrl,
            @Value("${openai.api.key}") String apiKey,
            @Value("${openai.model}") String model) {

        this.apiKey = apiKey;
        this.model = model;

        this.restClient = RestClient.builder()
                .baseUrl(apiUrl)
                .build();
    }

    @Override
    public String generateSummary(String text) {

        OpenAIRequest request = new OpenAIRequest(
                model,
                "Summarize the following text concisely:\n\n" + text
        );

        OpenAIResponse response = restClient.post()
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(OpenAIResponse.class);

        return extractText(response);
    }

    private String extractText(OpenAIResponse response) {

        if (response == null
                || response.getOutput() == null
                || response.getOutput().isEmpty()) {

            throw new IllegalStateException(
                    "AI response did not contain any output"
            );
        }

        // OpenAI can return multiple output items.
        // The first one may be a reasoning item.
        // We need to find the message item containing output_text.

        for (OpenAIResponse.OutputItem outputItem : response.getOutput()) {

            if (!"message".equals(outputItem.getType())) {
                continue;
            }

            if (outputItem.getContent() == null
                    || outputItem.getContent().isEmpty()) {
                continue;
            }

            for (OpenAIResponse.ContentItem contentItem
                    : outputItem.getContent()) {

                if ("output_text".equals(contentItem.getType())
                        && contentItem.getText() != null
                        && !contentItem.getText().isBlank()) {

                    return contentItem.getText();
                }
            }
        }

        throw new IllegalStateException(
                "AI response did not contain any output text"
        );
    }
}