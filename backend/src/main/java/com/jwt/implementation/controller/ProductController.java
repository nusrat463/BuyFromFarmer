package com.jwt.implementation.controller;

import com.jwt.implementation.model.Category;
import com.jwt.implementation.model.Product;
import com.jwt.implementation.repository.ProductRepository;
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
public class ProductController {

    @Autowired
    ProductRepository productRepository;

    //     CREATE A NEW Product

    @RequestMapping(value = "/product",
            method = RequestMethod.POST,
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> createNewProduct(@RequestBody Product product) throws URISyntaxException {
        Long maxId= productRepository.getMaxId();
        Long newId=(maxId==null)?1:(maxId+1);
        product.setId(newId);
        Product result= productRepository.save(product);
        return ResponseEntity.ok()
                .body(result);
    }


    // UPDATE AN EXISTING Product

    @RequestMapping(value = "/product", //
            method = RequestMethod.PUT, //
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    @ResponseBody
    public ResponseEntity<?> updateProduct(@RequestBody Product product) throws URISyntaxException {
        if (product.getId() == null) {
            return createNewProduct(product);
        }
        Product result = productRepository.save(product);
        return ResponseEntity.ok()
                .body(result);
    }


    // FIND A Product BY ID

    @RequestMapping(value = "/product/{id}", //
            method = RequestMethod.GET, //
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    @ResponseBody
    public ResponseEntity<?> getProductById(@PathVariable("id") Long id) {
        return Optional.ofNullable(productRepository.findById(id))
                .map(product -> new ResponseEntity<>(product, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "/product/getAllProduct",
            method = RequestMethod.GET, //
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    @ResponseBody
    public ResponseEntity<?> getAllProduct() {
        return Optional.ofNullable(productRepository.findAll())
                .map(product -> new ResponseEntity<>(product, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    @RequestMapping(value = "/product/delete/{id}",
            method = RequestMethod.DELETE,
            produces = { MediaType.APPLICATION_JSON_VALUE })
    @ResponseBody
    public ResponseEntity<Map<String, String>> deleteProductById(@PathVariable("id") Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "Product deleted successfully"));
        }

        productRepository.deleteById(id);
        return ResponseEntity.ok(Collections.singletonMap("message", "Product deleted successfully"));
    }

    @RequestMapping(value = "/product/getProductByCategoryId/{categoryId}",
            method = RequestMethod.GET, //
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    @ResponseBody
    public ResponseEntity<?> getProductsByCategoryId(@PathVariable("categoryId") Long categoryId) {
        return Optional.ofNullable(productRepository.findProductByCategoryId(categoryId))
                .map(product -> new ResponseEntity<>(product, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

}
