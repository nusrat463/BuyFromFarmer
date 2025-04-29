import { Component } from '@angular/core';
import {Farmer, FarmerService} from "../../services/farmer.service";

@Component({
  selector: 'app-farmers',
  templateUrl: './farmers.component.html',
  styleUrls: ['./farmers.component.css']
})
export class FarmersComponent {

  constructor(private farmerService: FarmerService) {}

  farmers: Farmer[] = [];
  selectedFarmer: any = null;

  ngOnInit(): void {
    this.farmerService.getAllFarmer().subscribe(data => {
      this.farmers = data.map(farmer => ({
        ...farmer,
        imageUrl: farmer.imageUrl ? farmer.imageUrl.replace(/\\/g, '/') : ''
      }));
      console.log('data---',this.farmers);
    });
  }

  openPopup(farmer: any) {
    this.selectedFarmer = farmer;
  }


}
