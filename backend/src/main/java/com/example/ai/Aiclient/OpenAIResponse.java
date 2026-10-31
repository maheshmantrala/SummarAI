package com.example.ai.Aiclient;

import java.util.List;

public class OpenAIResponse {

    private List<OutputItem> output;

    public OpenAIResponse() {
    }

    public List<OutputItem> getOutput() {
        return output;
    }

    public void setOutput(List<OutputItem> output) {
        this.output = output;
    }

    public static class OutputItem {

        private String type;
        private List<ContentItem> content;

        public OutputItem() {
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public List<ContentItem> getContent() {
            return content;
        }

        public void setContent(List<ContentItem> content) {
            this.content = content;
        }
    }

    public static class ContentItem {

        private String type;
        private String text;

        public ContentItem() {
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
}