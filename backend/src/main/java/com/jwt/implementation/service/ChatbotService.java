package com.jwt.implementation.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatbotService {

  private final RestTemplate restTemplate = new RestTemplate();

  public String processMessage(String message) {
    String nerApiUrl = "http://localhost:8000/ner";

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    Map<String, String> request = new HashMap<>();
    request.put("message", message);

    HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);

    ResponseEntity<Map> response = restTemplate.postForEntity(nerApiUrl, entity, Map.class);
    List<Map<String, String>> entities = (List<Map<String, String>>) response.getBody().get("entities");

    return generateResponse(message, entities);
  }

  private String generateResponse(String message, List<Map<String, String>> entities) {
    for (Map<String, String> entity : entities) {
      String word = entity.get("word").toLowerCase();
      String label = entity.get("entity_group");

      if ("PRODUCT".equals(label)) {
        return "Yes, " + word + " is available. Please visit: https://your-site.com/product?category=" + word;
      }
      if ("CATEGORY".equals(label)) {
        return "Looking for " + word + "? Here’s what we offer: https://your-site.com/product?category=" + word;
      }
      if ("PRICE".equals(label)) {
        return "Sure, I’ll find items under " + word + " for you.";
      }
    }

    return "I'm not sure how to help with that, but I'm happy to assist!";
  }
}
