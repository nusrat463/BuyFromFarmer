import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Product, ProductService} from "../../../services/product.service";
import {Farmer, FarmerService} from "../../../services/farmer.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {StockService} from "../../../services/stock.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-order-stock',
  templateUrl: './order-stock.component.html',
  styleUrls: ['./order-stock.component.css']
})
export class OrderStockComponent {
  products: Product [] = [];
  farmers: Farmer[] = [];
  stockForm!: FormGroup;
  units = ['Kg', 'Litre', 'Piece', 'Packet', 'Bundle'];

  constructor(private fb: FormBuilder,private productService: ProductService,
              private farmerService: FarmerService,private snackBar: MatSnackBar,
              private router: Router,private stockService: StockService,private location: Location) {}


  ngOnInit(): void {
    this.stockForm = this.fb.group({
      stockRows: this.fb.array([
        this.fb.group({
          product: ['', Validators.required],
          farmer: ['', Validators.required],
          quantity: [1, [Validators.required, Validators.min(1)]],
          unit: ['']
        })
      ])
    });

    this.productService.getAllProduct().subscribe(data => {
      this.products = data;
    });

    this.farmerService.getAllFarmer().subscribe(data => {
      this.farmers = data;
    });
  }

  get stockRows() {
    return this.stockForm.get('stockRows') as FormArray;
  }


  // Add a new stock row
  addRow() {
    this.stockRows.push(
      this.fb.group({
        product: ['', Validators.required],
        farmer: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]]
      })
    );
  }

  removeRow(index: number) {
    (this.stockForm.get('stockRows') as FormArray).removeAt(index);
  }

  onProductSelect(option: any, index: number) {
    (this.stockForm.get('stockRows') as FormArray).at(index).get('product')?.setValue(option);
  }

  onFarmerSelect(option: any, index: number) {
    (this.stockForm.get('stockRows') as FormArray).at(index).get('farmer')?.setValue(option);
  }

   orderStock() {
    if (this.stockForm.invalid) return;
    const formData = this.stockForm.value;
    if (formData.id == null) {
      this.stockService.orderStock(formData).subscribe(data=>{

        this.snackBar.open('Order Placed.');
        this.stockForm.reset();
        this.router.navigate(['/stock-list']);


      });
    } else {
      this.productService.updateProduct(formData).subscribe({
        next: () => {
          this.snackBar.open('Updated successfully!');
          this.stockForm.reset();
          this.router.navigate(['/stock-list']);
        },
        error: () => {
          this.snackBar.open('Failed to update.');
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
