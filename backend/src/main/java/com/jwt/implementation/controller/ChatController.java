package com.jwt.implementation.controller;

import com.jwt.implementation.service.ChatbotService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class ChatController {

  private final ChatbotService chatbotService;

  public ChatController(ChatbotService chatbotService) {
    this.chatbotService = chatbotService;
  }

  @RequestMapping(value = "/chat",
    method = RequestMethod.POST,
    produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
  @ResponseBody
  public ResponseEntity<Map<String, String>> chat(@RequestBody String userMessage) {
    String botReply = chatbotService.processMessage(userMessage);
    return ResponseEntity.ok(Collections.singletonMap("reply", botReply));
  }
}

