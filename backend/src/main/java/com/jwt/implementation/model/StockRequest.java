package com.jwt.implementation.model;

import java.util.List;

public class StockRequest {
  private List<Stock> stockRows;

  // Getters and Setters
  public List<Stock> getStockRows() {
    return stockRows;
  }

  public void setStockRows(List<Stock> stockRows) {
    this.stockRows = stockRows;
  }
}

