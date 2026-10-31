package com.example.ai.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GNewsResponse {

    private int totalArticles;
    private List<GNewsArticle> articles;

    public int getTotalArticles() {
        return totalArticles;
    }

    public void setTotalArticles(int totalArticles) {
        this.totalArticles = totalArticles;
    }

    public List<GNewsArticle> getArticles() {
        return articles;
    }

    public void setArticles(List<GNewsArticle> articles) {
        this.articles = articles;
    }
}
