package com.jwt.implementation.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "checkout")
public class Checkout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String email;

    private String phone;

    private double totalAmount;

    private String shippingAddress;

    private Date checkoutDate = new Date();

    @Lob
    @Column(columnDefinition = "TEXT")
    private String cartItemsJson; // This will store JSON string

    @Transient
    private List<CartItemDto> cartItems;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    // Set cart items
    public void setCartItems(List<CartItemDto> items) throws Exception {
        this.cartItems = items;
        ObjectMapper mapper = new ObjectMapper();
        this.cartItemsJson = mapper.writeValueAsString(items);
    }

    // Get cart items
    public List<CartItemDto> getCartItems() throws Exception {
        if (this.cartItems == null && this.cartItemsJson != null) {
            ObjectMapper mapper = new ObjectMapper();
            this.cartItems = mapper.readValue(this.cartItemsJson, new TypeReference<List<CartItemDto>>() {});
        }
        return this.cartItems;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public Date getCheckoutDate() {
        return checkoutDate;
    }

    public void setCheckoutDate(Date checkoutDate) {
        this.checkoutDate = checkoutDate;
    }
}

