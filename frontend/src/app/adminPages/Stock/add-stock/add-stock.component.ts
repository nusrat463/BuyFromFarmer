import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import {Product, ProductService} from "../../../services/product.service";
import {Farmer, FarmerService} from "../../../services/farmer.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {StockService} from "../../../services/stock.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent implements OnInit {
  stockForm!: FormGroup;
  products: Product [] = [];
  farmers: Farmer[] = [];
  units = ['Kg', 'Litre', 'Piece', 'Packet', 'Bundle'];

  constructor(private fb: FormBuilder,private productService: ProductService,
              private farmerService: FarmerService,private snackBar: MatSnackBar,
              private router: Router,private stockService: StockService,private location: Location) {}

  ngOnInit(): void {
    this.stockForm = this.fb.group({
      stockRows: this.fb.array([this.createStockRow()])
    });
     this.productService.getAllProduct().subscribe(data => {
      this.products = data;
     })
    this.farmerService.getAllFarmer().subscribe(data => {
      this.farmers = data;
    })
  }

  createStockRow() {
    return this.fb.group({
      id: [''],
      product: ['', Validators.required],
      farmer: ['', Validators.required],
      quantity: [[Validators.required, Validators.min(1)]],
      unit: ['']
    });
  }


  get stockRows() {
    return this.stockForm.get('stockRows') as FormArray;
  }


  addRow() {
    (this.stockForm.get('stockRows') as FormArray).push(this.createStockRow());
  }

  removeRow(index: number) {
    (this.stockForm.get('stockRows') as FormArray).removeAt(index);
  }

  onProductSelect(option: any, index: number) {
    (this.stockForm.get('stockRows') as FormArray).at(index).get('product')?.setValue(option);

    this.stockRows.at(index).patchValue({
      unit: option.unit  // assuming option has unit
    });
  }

  onFarmerSelect(option: any, index: number) {
    (this.stockForm.get('stockRows') as FormArray).at(index).get('farmer')?.setValue(option);
  }

  saveStock() {
    if (this.stockForm.invalid) return;

      const formData = this.stockForm.value;
      console.log('stock form---',formData)
      if (formData.id == null) {
        this.stockService.addToStock(formData).subscribe(data=>{

            this.snackBar.open('Added successfully!');
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
