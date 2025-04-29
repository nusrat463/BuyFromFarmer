import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {ProductComponent} from "./pages/product/product.component";
import {FarmersComponent} from "./pages/farmers/farmers.component";
import {CartComponent} from "./pages/cart/cart.component";
import {AuthGuard} from "./guards/auth.guard";
import {CheckoutComponent} from "./pages/checkout/checkout.component";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {AddProductComponent} from "./adminPages/Product/add-product/add-product.component";
import {UserGuard} from "./guards/user.guard";
import {AddCategoryComponent} from "./adminPages/Category/add-category/add-category.component";
import {AddFarmerComponent} from "./adminPages/Farmer/add-farmer/add-farmer.component";
import {CategoryListComponent} from "./adminPages/Category/category-list/category-list.component";
import {ProductListComponent} from "./adminPages/Product/product-list/product-list.component";
import {FarmerListComponent} from "./adminPages/Farmer/farmer-list/farmer-list.component";
import {StockListComponent} from "./adminPages/Stock/stock-list/stock-list.component";
import {AddStockComponent} from "./adminPages/Stock/add-stock/add-stock.component";
import {OrderStockComponent} from "./adminPages/Stock/order-stock/order-stock.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'product', component: ProductComponent },
  { path: 'farmer', component: FarmersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartComponent,canActivate: [UserGuard] },
  { path: 'checkout', component: CheckoutComponent,canActivate: [UserGuard]},
  { path: 'category-list', component: CategoryListComponent,canActivate: [AuthGuard] },
  { path: 'add-category', component: AddCategoryComponent,canActivate: [AuthGuard] },
  { path: 'product-list', component: ProductListComponent,canActivate: [AuthGuard] },
  { path: 'add-product', component: AddProductComponent,canActivate: [AuthGuard] },
  { path: 'farmer-list', component: FarmerListComponent,canActivate: [AuthGuard] },
  { path: 'add-farmer', component: AddFarmerComponent,canActivate: [AuthGuard] },
  { path: 'stock-list', component: StockListComponent,canActivate: [AuthGuard] },
  { path: 'add-stock', component: AddStockComponent ,canActivate: [AuthGuard] },
  { path: 'order-stock', component: OrderStockComponent,canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
