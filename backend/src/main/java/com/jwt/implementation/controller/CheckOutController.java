package com.jwt.implementation.controller;
import com.jwt.implementation.model.CartItemDto;
import com.jwt.implementation.model.Checkout;
import com.jwt.implementation.model.Stock;
import com.jwt.implementation.repository.CheckOutRepository;
import com.jwt.implementation.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class CheckOutController{

    @Autowired
    private CheckOutRepository checkOutRepository;

  @Autowired
  private StockRepository stockRepository;


    //     CREATE A NEW CHECKOUT

    @RequestMapping(value = "/checkOut",
            method = RequestMethod.POST,
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> createNewCheckOut(@RequestBody Checkout checkOut) throws Exception {
        Long maxId= checkOutRepository.getMaxId();
        Long newId=(maxId==null)?1:(maxId+1);
        checkOut.setId(newId);
        checkOut.setCartItems(checkOut.getCartItems());
        stockSaleController(checkOut.getCartItems());
        Checkout result = checkOutRepository.save(checkOut);
        return ResponseEntity.ok().body(result);
    }


  public void stockSaleController(@RequestBody List<CartItemDto> cartItemList) {
      for (CartItemDto cartItemDto : cartItemList) {
        Optional<Stock> stock = stockRepository.findById(cartItemDto.getProductId());
        if (stock.isPresent()) {
          Stock stockisPresent = stock.get();
          int quantity = stockisPresent.getQuantity() - cartItemDto.getQuantity();
          stockisPresent.setQuantity(quantity);
          stockRepository.save(stockisPresent);
        }
      }
  }


    // UPDATE AN EXISTING CHECKOUT

    @RequestMapping(value = "/checkOut", //
            method = RequestMethod.PUT, //
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    @ResponseBody
    public ResponseEntity<?> updateOrder(@RequestBody Checkout checkout) throws Exception {
        if (checkout.getId() == null) {
            return createNewCheckOut(checkout);
        }
        Checkout result = checkOutRepository.save(checkout);
        return ResponseEntity.ok()
                .body(result);
    }


    // FIND A CHECKOUT BY ID

    @RequestMapping(value = "/checkOut/{id}", //
            method = RequestMethod.GET, //
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    @ResponseBody
    public ResponseEntity<?> getCheckOutById(@PathVariable("id") Long id) {
        return Optional.ofNullable(checkOutRepository.findById(id))
                .map(checkOut -> new ResponseEntity<>(checkOut, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

}
