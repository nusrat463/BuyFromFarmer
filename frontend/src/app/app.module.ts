import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';
import { FarmersComponent } from './pages/farmers/farmers.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {TokenInterceptor} from "./auth/token-interceptor.service";
import { CheckoutComponent } from './pages/checkout/checkout.component';
import {CommonModule} from "@angular/common";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddProductComponent } from './adminPages/Product/add-product/add-product.component';
import { AddCategoryComponent } from './adminPages/Category/add-category/add-category.component';
import { AddFarmerComponent } from './adminPages/Farmer/add-farmer/add-farmer.component';
import { CategoryListComponent } from './adminPages/Category/category-list/category-list.component';
import { FarmerListComponent } from './adminPages/Farmer/farmer-list/farmer-list.component';
import { ProductListComponent } from './adminPages/Product/product-list/product-list.component';
import {StockListComponent} from "./adminPages/Stock/stock-list/stock-list.component";
import {AddStockComponent} from "./adminPages/Stock/add-stock/add-stock.component";
import {OrderStockComponent} from "./adminPages/Stock/order-stock/order-stock.component";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import { CustomSearchableDropdownComponent } from './components/custom-searchable-dropdown/custom-searchable-dropdown.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductComponent,
    FarmersComponent,
    NavbarComponent,
    CartComponent,
    LoginComponent,
    RegisterComponent,
    CheckoutComponent,
    AddProductComponent,
    AddCategoryComponent,
    AddFarmerComponent,
    CategoryListComponent,
    FarmerListComponent,
    ProductListComponent,
    StockListComponent,
    AddStockComponent,
    OrderStockComponent,
    CustomSearchableDropdownComponent,
    ChatbotComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
