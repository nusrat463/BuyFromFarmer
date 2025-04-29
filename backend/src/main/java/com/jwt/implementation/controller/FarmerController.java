package com.jwt.implementation.controller;
import com.jwt.implementation.model.Farmer;
import com.jwt.implementation.model.Product;
import com.jwt.implementation.model.Stock;
import com.jwt.implementation.model.StockRequest;
import com.jwt.implementation.repository.FarmerRepository;
import com.jwt.implementation.service.TwilioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class FarmerController{

    @Autowired
    private FarmerRepository farmerRepository;

    //     CREATE A NEW Farmer

    @RequestMapping(value = "/farmer",
            method = RequestMethod.POST,
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> createNewProduct(@RequestBody Farmer farmer) throws URISyntaxException {
        Long maxId= farmerRepository.getMaxId();
        Long newId=(maxId==null)?1:(maxId+1);
        farmer.setId(newId);
        Farmer result= farmerRepository.save(farmer);
        return ResponseEntity.ok()
                .body(result);
    }


    // UPDATE AN EXISTING Farmer

    @RequestMapping(value = "/farmer", //
            method = RequestMethod.PUT, //
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    @ResponseBody
    public ResponseEntity<?> updateProduct(@RequestBody Farmer farmer) throws URISyntaxException {
        if (farmer.getId() == null) {
            return createNewProduct(farmer);
        }
        Farmer result = farmerRepository.save(farmer);
        return ResponseEntity.ok()
                .body(result);
    }


    // FIND A Farmer BY ID

    @RequestMapping(value = "/farmer/{id}", //
            method = RequestMethod.GET, //
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    @ResponseBody
    public ResponseEntity<?> getProductById(@PathVariable("id") Long id) {
        return Optional.ofNullable(farmerRepository.findById(id))
                .map(farmer -> new ResponseEntity<>(farmer, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "/farmer/getAllFarmer",
            method = RequestMethod.GET, //
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    @ResponseBody
    public ResponseEntity<?> getAllFarmer() {
        return Optional.ofNullable(farmerRepository.findAll())
                .map(farmer -> new ResponseEntity<>(farmer, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    @RequestMapping(value = "/farmer/delete/{id}",
            method = RequestMethod.DELETE,
            produces = { MediaType.APPLICATION_JSON_VALUE })
    @ResponseBody
    public ResponseEntity<Map<String, String>> deleteFarmerById(@PathVariable("id") Long id) {
        if (!farmerRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "Farmer deleted successfully"));
        }

        farmerRepository.deleteById(id);
        return ResponseEntity.ok(Collections.singletonMap("message", "Farmer deleted successfully"));
    }

    @GetMapping("/farmer/getFarmerforHomePage")
    public List getAllCategory() {
        return farmerRepository.findFirst6Farmers();
    }

}
