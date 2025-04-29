import { Injectable, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StockService } from './stock.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class LowStockService implements OnDestroy {
  private subscription: Subscription = new Subscription();
  private lowStocks: any[] = [];

  constructor(private stockService: StockService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.startLowStockCheck();
  }
  startLowStockCheck(): void {
    this.checkLowStock();

    this.subscription.add(
      interval(4 * 60 * 60 * 1000)
        .subscribe(() => {
          console.log('Interval triggered');
          this.checkLowStock();
        })
    );
  }


  private checkLowStock(): void {
    console.log('t---')
    this.stockService.getLowStocks().subscribe(
      (response) => {
        this.lowStocks = response;
        console.log('stock---',this.lowStocks)
        if (this.lowStocks.length > 0) {
          this.showNotification();
        }
      },
      (error) => {
        console.error('Error fetching low stocks', error);
      }
    );
  }

  private showNotification(): void {
    const productNames = this.lowStocks.map((stock) => stock.product.name).join(', ');
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

    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
