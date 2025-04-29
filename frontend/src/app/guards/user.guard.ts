import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import {AuthService} from "../auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,
              private snackBar: MatSnackBar) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      this.router.navigate(['/login']);
      return of(false);
    }

    const decoded: any = this.authService.decodeJwt(token);
    if (decoded.role === 'USER') {
      return of(true);
    }

    this.router.navigate(['/']);
    this.snackBar.open('Not authorized');
    return of(false);
  }
}
