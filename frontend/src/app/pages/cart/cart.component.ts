import { Component, OnInit } from '@angular/core';
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.calculateTotal();
  }

  // Increment item quantity
  incrementQuantity(item: any) {
    this.cartService.updateQuantity(item.productId, item.quantity + 1);
    this.cart = this.cartService.getCart(); // Refresh cart
    this.calculateTotal();
  }

  // Decrement item quantity
  decrementQuantity(item: any) {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.productId, item.quantity - 1);
      this.cart = this.cartService.getCart(); // Refresh cart
      this.calculateTotal();
    }
  }

  // Remove item from cart
  removeItem(productId: any) {
    this.cartService.removeFromCart(productId);
    this.cart = this.cartService.getCart(); // Refresh cart
    this.calculateTotal();
  }

  // Calculate total price
  calculateTotal() {
    this.total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }


}

