package com.jwt.implementation.controller;

import com.jwt.implementation.model.Farmer;
import com.jwt.implementation.repository.FarmerRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import static org.mockito.Mockito.mock;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class FarmerControllerTest {

  @InjectMocks
  private FarmerController farmerController;
  @Mock
  private FarmerRepository farmerRepository;


  @Test
  public void testCreateNewProduct() throws URISyntaxException {
    Farmer farmer = new Farmer();
    when(farmerRepository.getMaxId()).thenReturn(5L);
    when(farmerRepository.save(any(Farmer.class))).thenAnswer(i -> i.getArgument(0));

    ResponseEntity<?> farmerFrmController = farmerController.createNewProduct(farmer);
    Farmer saved = (Farmer) farmerFrmController.getBody();
    Assertions.assertEquals(6L, saved.getId());

  }

  @Test
  public void testUpdateProduct() throws URISyntaxException {
    Farmer farmer = new Farmer();
    farmer.setId(10L);
    when(farmerRepository.save(any(Farmer.class))).thenReturn(farmer);
    ResponseEntity<?> response = farmerController.updateProduct(farmer);
    System.out.println("Actual Status Code: " + response.getStatusCodeValue());
    System.out.println("Response Body: " + response.getBody());
    assertEquals(farmer, response.getBody());
  }


  @Test
  public void testGetProductById() {
    Farmer farmer = new Farmer();
    farmer.setId(1L);

    when(farmerRepository.findById(any(Long.class))).thenReturn(Optional.of(farmer));

    ResponseEntity<?> response = farmerController.getProductById(1L);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(farmer, response.getBody());
  }

  @Test
  public void testGetAllFarmer(){
    List<Farmer> farmers = new ArrayList<>();

    when(farmerRepository.findAll()).thenReturn(farmers);

    ResponseEntity<?> farmers1 = farmerController.getAllFarmer();

    assertEquals(HttpStatus.OK,farmers1.getStatusCode());
    assertEquals(farmers,farmers1.getBody());
  }


  @Test
  public void testGetAllCategory(){
    List<Farmer> farmers = new ArrayList<>();

    when(farmerRepository.findFirst6Farmers()).thenReturn(farmers);

    List<Farmer> farmers1 = farmerController.getAllCategory();

    assertEquals(farmers,farmers1);
  }


  @Test
  public void testDeleteFarmerById(){
    boolean exist = false;
    Farmer farmer = new Farmer();
    farmer.setId(1L);

    when(farmerRepository.existsById(farmer.getId())).thenReturn(exist);

    ResponseEntity<?> farmer1 = farmerController.deleteFarmerById(farmer.getId());

    assertEquals(HttpStatus.NOT_FOUND,farmer1.getStatusCode());
  }
}
