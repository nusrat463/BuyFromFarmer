package com.jwt.implementation.controller;

import com.jwt.implementation.model.CartItemDto;
import com.jwt.implementation.model.Product;
import com.jwt.implementation.model.Stock;
import com.jwt.implementation.model.StockRequest;
import com.jwt.implementation.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class StockController {

  @Autowired
  StockRepository stockRepository;

  // Add or update stock
    @RequestMapping(value = "/stock",
            method = RequestMethod.POST,
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> addStock(@RequestBody StockRequest stockRequest) {
      List<Stock> savedStocks = new ArrayList<>();

      for (Stock s : stockRequest.getStockRows()) {
        Long maxId = stockRepository.getMaxId();
        Long newId = (maxId == null) ? 1 : (maxId + 1);
        s.setId(newId);

        Stock result = stockRepository.save(s);
        savedStocks.add(result);
      }
      return ResponseEntity.ok(savedStocks);
  }


  @RequestMapping(value = "/stock/getStockList",
    method = RequestMethod.GET, //
    produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
  @ResponseBody
  public ResponseEntity<?> getStockList() {
    return Optional.ofNullable(stockRepository.findAll())
      .map(stock -> new ResponseEntity<>(stock, HttpStatus.OK))
      .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }


  @GetMapping("/stock/lowStock")
  public ResponseEntity<List<Stock>> getLowStocks() {
    List<Stock> lowStocks = getStocksBelowThreshold();  // This can fetch from DB if scheduled task saved it
    return ResponseEntity.ok(lowStocks);
  }

  @Scheduled(cron = "0 0 9 * * *")
  public List<Stock> getStocksBelowThreshold() {
    int THRESHOLD = 10;
    List<Stock> lowStocks = new ArrayList<>();
    List<Stock> stock = stockRepository.findAll();
    for (Stock s : stock) {
      if (s.getQuantity() < THRESHOLD) {
        lowStocks.add(s);
      }
    }
    return lowStocks;
  }
}
