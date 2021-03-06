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
import { ProductListComponent } from './product/product-list/product-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchBarComponent } from './common/search-bar/search-bar.component';
import { ContactListEditDialogComponent } from './contact/contact-list-edit-dialog/contact-list-edit-dialog.component';
import { ProductListEditDialogComponent } from './product/product-list-edit-dialog/product-list-edit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactListComponent,
    ProductListComponent,
    DashboardComponent,
    SearchBarComponent,
    ContactListEditDialogComponent,
    ProductListEditDialogComponent,
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
