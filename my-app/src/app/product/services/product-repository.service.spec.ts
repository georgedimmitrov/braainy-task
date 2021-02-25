import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductRepositoryService } from './product-repository.service';
import { Product } from '../models/product.model';
import { ProductsResponse } from '../models/products-response.model';
import { BillyMetaResponse } from 'src/app/contact/models/billy-meta-response.model';

describe('ProductRepositoryService', () => {
  let service: ProductRepositoryService;
  let httpTestingController: HttpTestingController;
  let baseUrl = 'http://localhost:3080/api/products';
  let productsSampleResponse: ProductsResponse;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.get(HttpTestingController);
    productsSampleResponse = {
      products: [
        new Product({
          id: '1',
          name: 'test product',
        }),
      ],
      meta: {} as BillyMetaResponse,
    };
    service = TestBed.inject(ProductRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return data on successful request to all products', () => {
    let result: ProductsResponse;

    service.getProducts().subscribe((p) => {
      result = p;
    });
    const req = httpTestingController.expectOne({
      method: 'GET',
      url: baseUrl,
    });

    req.flush(productsSampleResponse);

    expect(result).toEqual(productsSampleResponse);
  });

  it('should throw error when network is down', () => {
    let error: string;
    service.getProducts().subscribe(null, (e) => {
      error = e;
    });

    let req = httpTestingController.expectOne(baseUrl);
    req.flush('Something went wrong', {
      status: 400,
      statusText: 'Network error',
    });

    expect(error.indexOf('Error retrieving products data') >= 0).toBeTruthy();
  });

  it('should call POST request to create a new product', () => {
    service.addProduct(productsSampleResponse.products[0]).subscribe();

    let req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/add-product`,
    });
    expect(req.request.body).toEqual(productsSampleResponse.products[0]);
  });

  it('should call PUT request to update an existing product', () => {
    const product = productsSampleResponse.products[0];

    service.updateProduct(product.id, product).subscribe();

    let req = httpTestingController.expectOne({
      method: 'PUT',
      url: `${baseUrl}/update-product/${product.id}`,
    });
    expect(req.request.body).toEqual(product);
  });
});
