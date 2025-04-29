package com.jwt.implementation.service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioService {

  @Value("${twilio.phone.number}")
  private String twilioPhoneNumber;

  public void sendSms(String toPhoneNumber, String messageContent) {
    // Send SMS
    Message message = Message.creator(
      new PhoneNumber(toPhoneNumber),  // Recipient's phone number
      new PhoneNumber(twilioPhoneNumber),  // Your Twilio number
      messageContent)  // The message
      .create();

  }
}


