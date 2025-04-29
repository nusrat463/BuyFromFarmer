import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CartItem, CartService} from "../../services/cart.service";
import {environment} from "../../../environments/environment";
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import {CheckoutService} from "../../services/checkout.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StockService} from "../../services/stock.service";


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router,private stockService: StockService,
              private fb: FormBuilder,private cartService: CartService,private checkoutService: CheckoutService,
              private snackBar: MatSnackBar) {}

  stripePromise = loadStripe(environment.stripePublicKey);
  stripe!: Stripe;
  elements!: StripeElements;
  cardElement!: StripeCardElement;

  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  totalPrice = 0;

  async ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('You must be logged in to proceed to checkout.');
      this.router.navigate(['/login']);
      return;
    }

    this.checkoutForm = this.fb.group({
      username: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      shippingAddress: ['', Validators.required],
      cartItems:[''],
      paymentMethod: ['cash'],
      totalAmount: ['']
    });

    this.checkoutForm.patchValue({
      username: this.authService.getUsername(),
      email: this.authService.getEmail(),
      cartItems: this.cartService.getCart()
    });
    this.cartItems = this.cartService.getCart();
    this.calculateTotal();

    // Handle payment method change
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(async (method) => {
      if (method === 'card') {
        const stripe = await this.stripePromise;
        if (!stripe) return;

        this.elements = stripe.elements();

        // Wait for the DOM to render #card-element
        setTimeout(() => {
          this.cardElement = this.elements.create('card');
          this.cardElement.mount('#card-element');

          // Optional: handle real-time validation
          this.cardElement.on('change', (event) => {
            const displayError = document.getElementById('card-errors');
            if (displayError) {
              displayError.textContent = event.error ? event.error.message : '';
            }
          });
        });
      }
    });
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      this.checkoutForm.patchValue({
        totalAmount: this.totalPrice
      });
      const formValues = this.checkoutForm.value;
      this.checkoutService.createPaymentIntent(formValues.totalAmount, 'Cart Checkout').subscribe({
        next: async (res) => {
          const clientSecret = res.clientSecret;

          const stripe = await this.stripePromise;
          if (!stripe) return;

          const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: this.cardElement,
              billing_details: {
                name: formValues.username,
                email: formValues.email
              }
            }
          });

          if (error) {
            this.snackBar.open('❌ Payment failed');
          } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            this.checkoutService.submitCheckout(formValues).subscribe({
              next: (response) => {
                this.snackBar.open('Order placed.');
                console.log('formValues.cartItems---',formValues.cartItems)

                this.cartService.clearCart();
                this.router.navigate(['/']);
              },
              error: (err) => {
                this.snackBar.open('❌ Order placement failed');
              }
            });
          }
        }
      });

    } else {
      alert('Please fill all fields correctly');
    }
  }
}
