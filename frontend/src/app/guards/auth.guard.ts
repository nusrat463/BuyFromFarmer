import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../auth/auth.service';
import {map, Observable, of, take} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,
              private snackBar: MatSnackBar) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      this.router.navigate(['/login']);
      return of(false);
    }

    const decoded: any = this.authService.decodeJwt(token);
    if (decoded.role === 'ADMIN') {
      return of(true);
    }

    this.router.navigate(['/']);
    this.snackBar.open('Not authorized');
    return of(false);
  }
}
