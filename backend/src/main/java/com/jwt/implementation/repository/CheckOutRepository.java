package com.jwt.implementation.repository;

import com.jwt.implementation.model.Checkout;
import com.jwt.implementation.model.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CheckOutRepository extends JpaRepository<Checkout, Long> {
    @Query("SELECT MAX(c.id) FROM Checkout c")
    Long getMaxId();
}
