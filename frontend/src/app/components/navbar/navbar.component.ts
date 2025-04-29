import { Component } from '@angular/core';
import {CartService} from "../../services/cart.service";
import {AuthService} from "../../auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  cartCount: number = 0;
  username: string | null = null;
  isLoggedIn = false;
  isAdminLoggedIn = false;
  isUserLoggedIn = false;

  constructor(private cartService: CartService,private authService: AuthService,
              private snackBar:MatSnackBar) {}

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdminLoggedIn = this.authService.isAdmin();
    this.isUserLoggedIn = this.authService.isUser();
    this.username = this.authService.getUsername();
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isAdminLoggedIn = this.authService.isAdmin();
    this.isUserLoggedIn = this.authService.isUser();
    this.snackBar.open('Logged out successfully');
  }

}
