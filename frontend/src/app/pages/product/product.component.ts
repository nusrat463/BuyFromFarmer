import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {debounceTime, Subject} from "rxjs";
import {CartService} from "../../services/cart.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Product, ProductService} from "../../services/product.service";
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-rice',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{

  constructor(private productService: ProductService,private route: ActivatedRoute,
              private cartService: CartService,private snackBar: MatSnackBar,
              private categoryService: CategoryService) {
  }

  Products: Product[] = [];
  categoryName! : string;
  categoryId!: number;
  allProducts: Product[] = [];
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  cart: Product[] = [];
  cartCount = 0;

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe((term) => {
      this.applySearch(term);
    });

    this.route.queryParamMap.subscribe(params => {
      this.categoryName = params.get('category')!;
      if (this.categoryName) {
        // If category is selected, get the categoryId and fetch products by category
        this.categoryService.getCategoryIdByNm(this.categoryName).subscribe(data => {
          this.categoryId = data;
          this.getProductByCategoryId(this.categoryId);
        });
      } else {
        // If no category selected, fetch all products
        this.getAllProducts();
      }
      });

    //cart
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
      this.cartCount = this.cart.length;
    }
  }


  getProductByCategoryId(id: number){
    this.productService.getProductByCategoryId(id).subscribe(data => {
      this.Products = data.map(product => ({
        ...product,
        image: product.image ? '/' + product.image.replace(/\\/g, '/') : ''
      }));
      this.allProducts = this.Products;
    })
  }

  getAllProducts(){
    this.productService.getAllProduct().subscribe(data => {
      this.Products = data.map(product => ({
        ...product,
        image: product.image ? '/' + product.image.replace(/\\/g, '/') : ''
      }));
      this.allProducts = this.Products;
    })
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  applySearch(term: string) {
    if (!term.trim()) {
      this.Products = this.allProducts;
    } else {
      const lower = term.toLowerCase();
      this.Products = this.allProducts.filter(product =>
        product.name.toLowerCase().includes(lower)
      );
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.snackBar.open('added to cart');
  }
}
