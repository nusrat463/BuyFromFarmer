package com.jwt.implementation.repository;

import com.jwt.implementation.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StockRepository extends JpaRepository<Stock, Long> {
  @Query("SELECT MAX(c.id) FROM Stock c")
  Long getMaxId();

}
