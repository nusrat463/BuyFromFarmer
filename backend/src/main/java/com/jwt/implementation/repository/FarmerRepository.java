package com.jwt.implementation.repository;

import com.jwt.implementation.model.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.persistence.Id;
import java.util.List;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, Long> {

    @Query("SELECT MAX(c.id) FROM Farmer c")
    Long getMaxId();

    @Query(value = "SELECT * FROM farmers ORDER BY id ASC LIMIT 6", nativeQuery = true)
    List<Farmer> findFirst6Farmers();

    @Query("SELECT f.phoneNo FROM Farmer f WHERE f.id = :farmerId")
    String findPhoneNumberByFarmerId(@Param("farmerId") Long id);
}
