import { Injectable } from '@angular/core';
import {Category} from "./category.service";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "./product.service";
import {Farmer} from "./farmer.service";

export interface Stock {
  id:number;
  product: Product;
  farmer: Farmer;
  quantity: number;
  unit: string;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addToStock(stock:any): Observable<Stock[]> {
    return this.http.post<Stock[]>(`${this.apiUrl}/stock`,stock);
  }

  getStockList(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/stock/getStockList`);
  }

  orderStock(stock:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/stock/orderStock`,stock);
  }

  getLowStocks(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stock/lowStock`);
  }

  reduceStock(cartItems: any[]): Observable<any> {
    console.log('cartItem---',cartItems)
    return this.http.post<any>(`${this.apiUrl}/stock/reduceStock`, cartItems);
  }

}
