import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    if (!req.url.includes('http://localhost:8038/api/uploadImage') && token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    else{
      console.log('token failed')
    }

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // Logout logic
          this.auth.logout();
          alert('Session expired. Please log in again.');

          // Navigate to the login page
          this.router.navigate(['/']);

          // Return EMPTY or an empty observable to stop further request handling
          return EMPTY;
        }

        // For other errors, continue propagating the error
        return throwError(() => err);
      })
    );
  }
}
