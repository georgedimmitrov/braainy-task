import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactListComponent } from './contact/contact-list/contact-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { ProductListComponent } from './product/product-list/product-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'contact/contact-list', component: ContactListComponent },

  { path: 'product/product-list', component: ProductListComponent },
  { path: 'product/add-product', component: AddProductComponent },
  { path: 'product/edit-product/:id', component: ProductDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
