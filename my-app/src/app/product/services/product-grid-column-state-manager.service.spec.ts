import { TestBed } from '@angular/core/testing';

import { ProductGridColumnStateManagerService } from './product-grid-column-state-manager.service';

describe('ProductGridColumnStateManagerService', () => {
  let service: ProductGridColumnStateManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductGridColumnStateManagerService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getColumnsState should provide visible default values', () => {
    const initialState = service.getColumnsState();
    expect(initialState.nameColumn).toEqual(true);
    expect(initialState.descriptionColumn).toEqual(true);
    expect(initialState.productNoColumn).toEqual(true);
    expect(initialState.isArchivedColumn).toEqual(true);
  });

  it('local storage should be empty by default', () => {
    const local = localStorage.getItem('products-grid-column-state');
    expect(local).toBe(null);
  });

  it('local storage should be set after getColumnsState is called', () => {
    service.getColumnsState();
    const local = localStorage.getItem('products-grid-column-state');
    expect(JSON.parse(local)).toEqual({
      nameColumn: true,
      descriptionColumn: true,
      productNoColumn: true,
      isArchivedColumn: true,
    });
  });
});
