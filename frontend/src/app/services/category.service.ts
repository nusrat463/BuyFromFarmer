import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

export interface Category {
  id:number;
  name: string;
  image: string;
}
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createNewCategory(category:any): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/category`,category);
  }

  updateCategory(category: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/category`, category);
  }


  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/category/${id}`);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/category/allCategory`);
  }

  getCategoryIdByNm(name: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/category/catIdByCatNm/${name}`);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/category/deleteById/${id}`);
  }


}
