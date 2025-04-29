import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Category} from "./category.service";
import {Farmer} from "./farmer.service";

export interface Product {
  id:number;
  name: string;
  image: string;
  price: number;
  unit: string;
  category: Category;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createNewProduct(product:any): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/product`,product);
  }

  updateProduct(product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/product`, product);
  }


  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/${id}`);
  }

  getAllProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/getAllProduct`);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/product/delete/${id}`);
  }


  getProductByCategoryId(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/getProductByCategoryId/${categoryId}`);
  }


}
