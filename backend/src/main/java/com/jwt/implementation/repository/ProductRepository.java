package com.jwt.implementation.repository;

import com.jwt.implementation.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT MAX(c.id) FROM Product c")
    Long getMaxId();

    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId")
    List<Product> findProductByCategoryId(@Param("categoryId") Long categoryId);
}
