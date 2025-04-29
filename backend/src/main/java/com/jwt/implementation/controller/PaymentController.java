package com.jwt.implementation.controller;

import com.jwt.implementation.model.PaymentRequest;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class PaymentController {

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody PaymentRequest paymentRequest) {
        try {
            // Build PaymentIntent parameters
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(paymentRequest.getAmount()) // Amount in cents
                    .setCurrency("usd")
                    .setDescription(paymentRequest.getDescription())
                    .build();

            // Create the payment intent directly here
            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Prepare JSON response
            Map<String, String> responseData = new HashMap<>();
            responseData.put("clientSecret", paymentIntent.getClientSecret());

            return ResponseEntity.ok(responseData);

        } catch (StripeException e) {
            // Log and return error response
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Stripe error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


}

