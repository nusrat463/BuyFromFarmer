import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Product, ProductService} from "../../../services/product.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProduct().subscribe(data => {
      this.products = data;
    });
  }

  editProduct(id: number) {
    this.router.navigate(['/add-product'], { queryParams: { id: id } });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.snackBar.open('Deleted successfully!');
        this.loadProducts();
      });
    }
  }
}


