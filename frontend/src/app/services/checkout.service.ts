import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import {CartItem} from "./cart.service";

export interface CheckoutData {
  name: string;
  email: string;
  address: string;
  paymentMethod: string;
  cartItems: CartItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  submitCheckout(data: CheckoutData): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkOut`, data);
  }

  createPaymentIntent(amount: number, description: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-payment-intent`, { amount, description });
  }

}
