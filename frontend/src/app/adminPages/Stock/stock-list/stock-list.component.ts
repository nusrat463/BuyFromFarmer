import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Stock, StockService} from "../../../services/stock.service";
import {interval, Subscription, switchMap} from "rxjs";

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent {
  stocks: Stock[] = [];
  lowStocks: Stock[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private stockService: StockService, private router: Router,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadProducts();
    this.setLowStockCheckInterval();
  }

  loadProducts() {
    this.stockService.getStockList().subscribe(data => {
      this.stocks = data;
    });
  }

  editProduct(id: number) {
    this.router.navigate(['/add-product'], { queryParams: { id: id } });
  }

  private setLowStockCheckInterval(): void {
    const MILLISECONDS_IN_HOUR = 60  * 1000;
    const BDT_OFFSET = 6; // Bangladesh Time (UTC+6)

    // Get current UTC time and convert to BDT (UTC+6)
    const nowInUTC = new Date();
    const bdtTime = new Date(nowInUTC.getTime() + BDT_OFFSET * MILLISECONDS_IN_HOUR);

    // Calculate time until next interval (e.g., 6 hours later in BDT)
    const nextIntervalTime = new Date(bdtTime.getTime() + 2 * MILLISECONDS_IN_HOUR);

    // Calculate the time difference between now and the next interval
    const timeUntilNextInterval = nextIntervalTime.getTime() - nowInUTC.getTime();

    // Start the interval after the calculated delay
    this.subscription.add(
      interval(timeUntilNextInterval) // Start after the timeUntilNextInterval
        .pipe(
          // Continue to run the interval every 6 hours
          switchMap(() => interval(1 * MILLISECONDS_IN_HOUR))
        )
        .subscribe(() => this.checkLowStock())
    );
  }

  ngOnDestroy(): void {
    // Clean up the subscription to prevent memory leaks
    this.subscription.unsubscribe();
  }

  checkLowStock(): void {
    this.stockService.getLowStocks().subscribe(
      (response) => {
        this.lowStocks = response;
        console.log('stock--',this.lowStocks);
        if (this.lowStocks.length > 0) {
          this.showNotification();
        }
      },
      (error) => {
        console.error('Error fetching low stocks', error);
      }
    );
  }

  showNotification(): void {
    const productNames = this.lowStocks
      .map((stock) => stock.product.name)
      .join(', ');

    const snackBarRef = this.snackBar.open(
      `Low stock warning! Products: ${productNames}`,
      'Close',
      {
        duration: 0,
        panelClass: ['low-stock-snack-bar'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      }
    );

    // Add a custom close behavior if needed
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }
}
