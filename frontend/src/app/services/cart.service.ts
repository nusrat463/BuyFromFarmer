import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartItem[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);

  cartCount$ = this.cartItemCount.asObservable(); // cart icon uses this

  constructor() {
    this.loadCart();
  }

  private updateCartCount() {
    const total = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartItemCount.next(total);
  }

  loadCart() {
    const savedCart = localStorage.getItem('cart');
    this.cart = savedCart ? JSON.parse(savedCart) : [];
    this.updateCartCount();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCartCount();
  }

  getCart() {
    return this.cart;
  }

  addToCart(product: any) {
    const index = this.cart.findIndex(item => item.productId === product.id);

    if (index > -1) {
      this.cart[index].quantity += 1;
    } else {
      this.cart.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      });

    }

    this.saveCart();
  }

  removeFromCart(productId: any) {
    const index = this.cart.findIndex(item => item.productId === productId);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
    this.saveCart();
  }

  // New method to update item quantity
  updateQuantity(productId: any, quantity: number) {
    const index = this.cart.findIndex(item => item.productId === productId);
    if (index > -1) {
      this.cart[index].quantity = quantity;
    }
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();  // Save empty cart to localStorage
  }

}
