package com.jwt.implementation.controller;
import com.jwt.implementation.model.Category;
import com.jwt.implementation.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;


    //     CREATE A NEW CATEGORY

    @RequestMapping(value = "/category",
            method = RequestMethod.POST,
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> createNewCategory(@RequestBody Category category) throws URISyntaxException {
        Long maxId= categoryRepository.getMaxId();
        Long newId=(maxId==null)?1:(maxId+1);
        category.setId(newId);
        Category result= categoryRepository.save(category);
        return ResponseEntity.ok()
                .body(result);
    }


    // UPDATE AN EXISTING CATEGORY

    @RequestMapping(value = "/category", //
            method = RequestMethod.PUT, //
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    @ResponseBody
    public ResponseEntity<?> updateCategory(@RequestBody Category category) throws URISyntaxException {
        if (category.getId() == null) {
            return createNewCategory(category);
        }
        Category result = categoryRepository.save(category);
        return ResponseEntity.ok()
                .body(result);
    }


    // FIND A CATEGORY BY ID

    @RequestMapping(value = "/category/{id}", //
            method = RequestMethod.GET, //
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    @ResponseBody
    public ResponseEntity<?> getCategoryById(@PathVariable("id") Long id) {
        return Optional.ofNullable(categoryRepository.findById(id))
                .map(category -> new ResponseEntity<>(category, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    @GetMapping("/category/allCategory")
    public List getAllCategory() {
        return categoryRepository.findAll();
    }


    @RequestMapping(value = "/category/catIdByCatNm/{name}",
            method = RequestMethod.GET, //
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    @ResponseBody
    public ResponseEntity<Long> getCategoryByName(@PathVariable("name") String name) {
        return Optional.ofNullable(categoryRepository.findCategoryByName(name))
                .map(id -> new ResponseEntity<>(id, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(
            value = "/category/deleteById/{id}",
            method = RequestMethod.DELETE,
            produces = { MediaType.APPLICATION_JSON_VALUE }
    )
    @ResponseBody
    public ResponseEntity<Map<String, String>> deleteCategoryById(@PathVariable("id") Long id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "Category deleted successfully"));
        }

        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Collections.singletonMap("message", "Category deleted successfully"));
    }


}
