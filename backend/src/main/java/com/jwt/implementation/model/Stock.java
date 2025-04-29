package com.jwt.implementation.model;

import javax.persistence.*;

@Entity
@Table(name = "stock")
public class Stock {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "product_id", nullable = false)
  private Product product;

  @OneToOne
  @JoinColumn(name = "farmer_id", nullable = false)
  private Farmer farmer;

  private int quantity;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Farmer getFarmer() {
    return farmer;
  }

  public void setFarmer(Farmer farmer) {
    this.farmer = farmer;
  }

  public Product getProduct() {
    return product;
  }

  public void setProduct(Product product) {
    this.product = product;
  }

  public int getQuantity() {
    return quantity;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }
}
