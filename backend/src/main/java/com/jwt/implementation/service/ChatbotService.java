package com.jwt.implementation.service;

import edu.stanford.nlp.pipeline.CoreDocument;
import edu.stanford.nlp.pipeline.CoreEntityMention;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

@Service
public class ChatbotService {

  private final StanfordCoreNLP stanfordCoreNLP;

  public ChatbotService() {
    Properties props = new Properties();
    props.setProperty("annotators", "tokenize,ssplit,pos,lemma,ner");
    props.setProperty("ner.model", "D:/Miscellaneous/Train ML/stanford-corenlp-4.5.4/custom-ner-training/ecommerce-ner.model.ser.gz");
    this.stanfordCoreNLP = new StanfordCoreNLP(props);
  }

  public String processMessage(String message) {
    CoreDocument document = new CoreDocument(message);
    stanfordCoreNLP.annotate(document);

    List<CoreEntityMention> entityMentions = document.entityMentions();

    StringBuilder entitiesText = new StringBuilder();
    for (CoreEntityMention entity : entityMentions) {
      entitiesText.append(entity.text())
        .append(" (")
        .append(entity.entityType())
        .append(") ");
    }

    return generateResponse(message.toLowerCase(), entityMentions, entitiesText.toString());
  }

  private String generateResponse(String message, List<CoreEntityMention> entityMentions, String entitiesText) {
    for (CoreEntityMention entity : entityMentions) {
      String value = entity.text().toLowerCase();
      String type = entity.entityType();

      // Product-specific link
      if (type.equals("PRODUCT")) {
        return "Yes, " + entity.text() + " is available. Please visit: http://localhost:4200/product";
      }

      // Category-specific link
      if (type.equals("CATEGORY")) {
        return "Looking for " + entity.text() + "? Explore options here: http://localhost:4200/product?category=" + value.replace(" ", "%20");
      }

      // Price filter
      if (type.equals("PRICE")) {
        return "Here are products under " + entity.text() + ": http://localhost:4200/product";
      }
    }

    // Supplier inquiry
    if (message.contains("supplier")) {
      return "Our suppliers are listed here: http://localhost:4200/suppliers";
    }

    // Discount or offer inquiry
    if (message.contains("discount") || message.contains("offer")) {
      return "Check our latest discounts at: http://localhost:4200/discounts";
    }

    // If some entities detected but not mapped
    if (!entitiesText.isEmpty()) {
      return "I noticed you're interested in: " + entitiesText + ". You can explore options here: http://localhost:4200/product";
    }

    // Default fallback
    return "I'm not sure how to help with that, but I’m happy to assist!";
  }


}
