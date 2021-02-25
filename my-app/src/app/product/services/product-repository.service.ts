import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ProductsResponse } from '../models/products-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductRepositoryService {
  // Node/Express API
  PRODUCTS_API: string = 'http://localhost:3080/api/products';

  // Http Header
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) {}

  // Get all
  getProducts(): Observable<ProductsResponse> {
    return this.httpClient.get<ProductsResponse>(`${this.PRODUCTS_API}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(
          `Error retrieving products data. ${error.statusText || 'Unknown'}`
        );
      })
    );
  }

  // Add
  addProduct(data: Product): Observable<any> {
    let API_URL = `${this.PRODUCTS_API}/add-product`;
    return this.httpClient
      .post(API_URL, data)
      .pipe(catchError(this.handleError));
  }

  // Update
  updateProduct(id: any, data: any): Observable<any> {
    let API_URL = `${this.PRODUCTS_API}/update-product/${id}`;
    return this.httpClient
      .put(API_URL, data, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Get single object
  // getProduct(id: string): Observable<any> {
  //   let API_URL = `${this.PRODUCTS_API}/product/${id}`;
  //   return this.httpClient.get(API_URL, { headers: this.httpHeaders }).pipe(
  //     map((res: any) => {
  //       return res || {};
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  // Error
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
