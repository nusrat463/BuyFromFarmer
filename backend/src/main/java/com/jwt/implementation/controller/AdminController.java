package com.jwt.implementation.controller;

import com.jwt.implementation.model.Farmer;
import com.jwt.implementation.model.Stock;
import com.jwt.implementation.model.StockRequest;
import com.jwt.implementation.repository.FarmerRepository;
import com.jwt.implementation.service.TwilioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class AdminController {

  @Autowired
  private FarmerRepository farmerRepository;

  @Autowired
  private TwilioService twilioService;

  @RequestMapping(value = "/stock/orderStock",
    method = RequestMethod.POST,
    produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
  @ResponseBody
  public void orderStock(@RequestBody StockRequest stockRequest) {
    Map<Farmer, List<Stock>> ordersGroupedBySupplier = new HashMap<>();

    // Group by supplierId
    for (Stock order : stockRequest.getStockRows()) {
      ordersGroupedBySupplier
        .computeIfAbsent(order.getFarmer(), k -> new ArrayList<>())
        .add(order);
    }

    // Now send SMS to each supplier
    for (Map.Entry<Farmer, List<Stock>> entry : ordersGroupedBySupplier.entrySet()) {
      Long supplierId = entry.getKey().getId();
      String supplierName = entry.getKey().getName();
      List<Stock> supplierOrders = entry.getValue();

      StringBuilder smsContent = new StringBuilder();
      smsContent.append("Dear ").append(supplierName).append("),\nYou have new stock orders:\n");

      for (Stock order : supplierOrders) {
        smsContent.append(order.getProduct().getName())
          .append(", Quantity: ")
          .append(order.getQuantity())
          .append(order.getProduct().getUnit())
          .append("\n");
      }

      sendSmsToSupplier(supplierId, smsContent.toString());
    }
  }

  private void sendSmsToSupplier(Long farmerId, String message) {

    String phoneNumber = farmerRepository.findPhoneNumberByFarmerId(farmerId);
    if (phoneNumber == null || phoneNumber.isEmpty()) {
      // Handle error if phone number is not found
      System.out.println("Farmer with ID " + farmerId + " does not have a valid phone number.");
      return;
    }
    // Send SMS using Twilio
    twilioService.sendSms(phoneNumber, message);
  }

  }

