import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };

  constructor(private auth: AuthService, private router: Router,private snackBar: MatSnackBar) {}

  login() {
    this.auth.login(this.credentials).subscribe({
      next: (res) => {
        this.auth.setToken(res.token);
        this.snackBar.open('Login successful!');
        this.router.navigate(['/']);
      },
      error: () => this.snackBar.open('Login failed'),
    });
  }

  googleLogin() {
    window.location.href = 'http://localhost:8038/oauth2/authorization/google';
  }

}
