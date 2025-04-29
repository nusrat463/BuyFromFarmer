import { Component } from '@angular/core';
import {Category, CategoryService} from "../../../services/category.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Farmer, FarmerService} from "../../../services/farmer.service";

@Component({
  selector: 'app-farmer-list',
  templateUrl: './farmer-list.component.html',
  styleUrls: ['./farmer-list.component.css']
})
export class FarmerListComponent {
  farmers: Farmer[] = [];

  constructor(private farmerService: FarmerService, private router: Router,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadFarmers();
  }

  loadFarmers() {
    this.farmerService.getAllFarmer().subscribe(data => {
      this.farmers = data;
    });
  }

  editFarmer(id: number) {
    this.router.navigate(['/add-farmer'], { queryParams: { id: id } });
  }

  deleteFarmer(id: number) {
    if (confirm('Are you sure you want to delete this farmers?')) {
      this.farmerService.deleteFarmer(id).subscribe(() => {
        this.snackBar.open('Deleted successfully!');
        this.loadFarmers();
      });
    }
  }
}

