import { Injectable } from '@angular/core';

export interface ProductsGridColumnsState {
  nameColumn: boolean;
  descriptionColumn: boolean;
  productNoColumn: boolean;
  isArchivedColumn: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductGridColumnStateManagerService {
  private readonly localStorageKey = 'products-grid-column-state';

  constructor() {}

  getColumnsState(): ProductsGridColumnsState {
    const localStorageItem = localStorage.getItem(this.localStorageKey);
    if (localStorageItem) {
      return JSON.parse(localStorageItem);
    } else {
      const initialState = this.getInitialColumnsState();
      localStorage.setItem(this.localStorageKey, JSON.stringify(initialState));
      return initialState;
    }
  }

  persistColumnsState(columnsState: ProductsGridColumnsState) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(columnsState));
  }

  private getInitialColumnsState(): ProductsGridColumnsState {
    return {
      nameColumn: true,
      descriptionColumn: true,
      productNoColumn: true,
      isArchivedColumn: true,
    };
  }
}
