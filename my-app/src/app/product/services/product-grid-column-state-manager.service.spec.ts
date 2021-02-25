import { TestBed } from '@angular/core/testing';

import { ProductGridColumnStateManagerService } from './product-grid-column-state-manager.service';

describe('ProductGridColumnStateManagerService', () => {
  let service: ProductGridColumnStateManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductGridColumnStateManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
