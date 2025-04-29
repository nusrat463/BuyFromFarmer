import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  sendMessage(message: string) {
    return this.http.post<any>(`${this.apiUrl}/chat`, message, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
