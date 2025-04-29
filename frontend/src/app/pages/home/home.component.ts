import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {Farmer, FarmerService} from "../../services/farmer.service";
import {Category, CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
constructor(private router: Router,private categoryService: CategoryService,
            private farmerService: FarmerService) {
}
  Categories: Category[] = [];
  farmersForHomePage: Farmer[] = [];

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe(data => {
      this.Categories = data.map(category => ({
        ...category,
        imageUrl: category.image ? category.image.replace(/\\/g, '/') : ''
      }));
    });

    //get farmers
    this.farmerService.getFarmerforHomePage().subscribe(data => {
      this.farmersForHomePage = data.map(farmer => ({
        ...farmer,
        imageUrl: farmer.imageUrl ? farmer.imageUrl.replace(/\\/g, '/') : ''
      }));
    })
  }

  showCategoryWiseProduct(name: string): void {
    this.router.navigate(['/product'], { queryParams: { category: name.toLowerCase() } });
  }

  goToFarmer(): void {
    this.router.navigate(['/farmer']);
  }
}
