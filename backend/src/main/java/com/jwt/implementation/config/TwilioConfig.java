package com.jwt.implementation.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.twilio.Twilio;

@Configuration
public class TwilioConfig {
  private final Dotenv dotenv = Dotenv.load();

  private final String ACCOUNT_SID = dotenv.get("TWILIO_SID");
  private final String AUTH_TOKEN = dotenv.get("TWILIO_AUTH_TOKEN");
  private final String PHONE_NUMBER = dotenv.get("TWILIO_PHONE_NUMBER");

  @Bean
  public void initTwilio() {
    if (ACCOUNT_SID == null || AUTH_TOKEN == null) {
      throw new RuntimeException("Twilio environment variables not set properly.");
    }

    Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    System.out.println("✅ Twilio initialized with SID: " + ACCOUNT_SID);
  }

  public String getAccountSid() {
    return ACCOUNT_SID;
  }

  public String getAuthToken() {
    return AUTH_TOKEN;
  }

  public String getPhoneNumber() {
    return PHONE_NUMBER;
  }
}
