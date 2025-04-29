import { Component } from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {LowStockService} from "./services/low-stock.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'farm-fresh-shop';
  constructor(private authService: AuthService,private lowStockService: LowStockService) {}
  ngOnInit(): void {
    this.lowStockService.startLowStockCheck();
    const token = new URLSearchParams(window.location.search).get('token');

    if (token) {
      this.authService.setToken(token);
      window.history.replaceState({}, document.title, '/');
    }
  }
}
