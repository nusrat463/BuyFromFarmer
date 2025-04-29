package com.jwt.implementation.repository;

import com.jwt.implementation.model.Category;
import com.jwt.implementation.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT MAX(c.id) FROM Category c")
    Long getMaxId();

    Category findByName(String name);

    @Query("SELECT p.id FROM Category p WHERE p.name = :name")
    Long findCategoryByName(@Param("name") String name);
}
