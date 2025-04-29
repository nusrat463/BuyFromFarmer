package com.jwt.implementation.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {
  private final Dotenv dotenv = Dotenv.configure().load();

  public String getStripeKey() {
    return dotenv.get("STRIPE_SECRET_KEY");
  }
}


