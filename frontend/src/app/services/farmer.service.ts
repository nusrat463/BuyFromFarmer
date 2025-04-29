import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { environment } from 'src/environments/environment';
import {Category} from "./category.service";

export interface Farmer {
  id:number;
  name: string;
  category: string;
  address: string;
  phoneNo: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class FarmerService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createNewFarmer(farmer:any): Observable<Farmer> {
    return this.http.post<Farmer>(`${this.apiUrl}/farmer`,farmer);
  }

  updateFarmer(farmer: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/farmer`, farmer);
  }


  getFarmerById(id: number): Observable<Farmer> {
    return this.http.get<Farmer>(`${this.apiUrl}/farmer/${id}`);
  }

  getAllFarmer(): Observable<Farmer[]> {
    return this.http.get<Farmer[]>(`${this.apiUrl}/farmer/getAllFarmer`);
  }

  deleteFarmer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/farmer/delete/${id}`);
  }

  getFarmerforHomePage(): Observable<Farmer[]> {
    return this.http.get<Farmer[]>(`${this.apiUrl}/farmer/getFarmerforHomePage`);
  }

}
