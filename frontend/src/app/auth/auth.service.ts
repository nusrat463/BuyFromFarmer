import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable, of, tap} from "rxjs";


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,private snackBar: MatSnackBar) {}

  register(user: any) {
    return this.http.post(`${this.apiUrl}/register`, user);
  }


  login(credentials: any) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Store the JWT token
        this.setToken( response.token);

        // Decode and store the role
        this.setUserRoleFromToken(response.token);
      })
    );
  }

  private setUserRoleFromToken(token: string) {
    const decodedToken = this.decodeJwt(token);
    const role = decodedToken?.role; // Extract the role from the JWT payload
    localStorage.setItem('role', role);  // Store role in localStorage
  }

  public decodeJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1])); // Decoding JWT token (payload)
    } catch (error) {
      return null;
    }
  }


  isAdmin(): boolean {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const decodedToken: any = this.decodeJwt(token); // Decode the JWT
      return decodedToken.role === 'ADMIN'; // Check if the role is ADMIN
    }
    return false;
  }

  isUser(): boolean {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const decodedToken: any = this.decodeJwt(token);
      return decodedToken.role === 'USER';
    }
    return false;
  }

  setToken(token: string) {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt_token');
  }


  logout() {
    localStorage.removeItem('jwt_token');
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub; // or payload.username depending on backend
  }

  getEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email || null;
  }

}
