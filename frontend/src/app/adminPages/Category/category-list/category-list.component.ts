import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Category, CategoryService} from "../../../services/category.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService, private router: Router,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data;
    });
  }

  editCategory(id: number) {
    this.router.navigate(['/add-category'], { queryParams: { id: id } });
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.snackBar.open('Deleted successfully!');
        this.loadCategories();
      });
    }
  }
}
