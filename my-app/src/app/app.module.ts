import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClarityModule } from '@clr/angular';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { ContactListComponent } from './contact/contact-list/contact-list.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchBarComponent } from './common/search-bar/search-bar.component';
import { ContactListEditDialogComponent } from './contact/contact-list-edit-dialog/contact-list-edit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactListComponent,
    AddProductComponent,
    ProductDetailComponent,
    ProductListComponent,
    DashboardComponent,
    SearchBarComponent,
    ContactListEditDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ClarityModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
