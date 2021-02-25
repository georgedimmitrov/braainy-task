import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Product } from '../models/product.model';
import {
  ProductGridColumnStateManagerService,
  ProductsGridColumnsState,
} from '../services/product-grid-column-state-manager.service';
import { ProductRepositoryService } from '../services/product-repository.service';
import { get as objectGet } from 'lodash';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product;
  columnsState: ProductsGridColumnsState;

  searchPhrase: string = '';

  isEditDialogOpened: boolean;
  isCreating: boolean;
  totalRecords: number;
  loading: boolean;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private productRepositoryService: ProductRepositoryService,
    private columnsStateManagerService: ProductGridColumnStateManagerService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.columnsState = this.columnsStateManagerService.getColumnsState();
    this.isEditDialogOpened = false;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getAllProducts() {
    this.loading = true;

    this.productRepositoryService
      .getProducts()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (productsResponse: any) => {
          this.products = productsResponse.products;
          this.filteredProducts = [...this.products];
          this.totalRecords = this.products.length;
        },
        (error: HttpErrorResponse) => {
          console.log('Could not get all products: ', error);
        }
      );
  }

  onAdd(): void {
    this.isCreating = true;
    this.selectedProduct = new Product();
    this.isEditDialogOpened = true;
  }

  onEdit(): void {
    this.isCreating = false;
    this.selectedProduct = new Product(this.selectedProduct);
    this.isEditDialogOpened = true;
  }

  onEditDialogClose(): void {
    this.isEditDialogOpened = false;
    this.selectedProduct = null;
  }

  onEditDialogSave(product: Product): void {
    if (this.isCreating) {
      this.create(product);
    } else {
      this.update(product);
    }
  }

  onSearchChange(search: string): void {
    const lowerCaseSearch = search.toLowerCase();
    this.filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseSearch) ||
        product.description.toLowerCase().includes(lowerCaseSearch) ||
        product.productNo.toLowerCase().includes(lowerCaseSearch)
    );
    this.totalRecords = this.filteredProducts.length;
  }

  disableEditButton(): boolean {
    return !this.selectedProduct;
  }

  private create(product: Product): void {
    this.loading = true;
    this.productRepositoryService
      .addProduct(product)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (savedProduct: Product) => {
          this.products.push(savedProduct);
          // show success message
          this.resetState();
        },
        (error: HttpErrorResponse) => {
          console.log('error creating new product: ', error);
        }
      );
  }

  private update(product: Product): void {
    this.loading = true;
    this.productRepositoryService
      .updateProduct(product.id, product)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (updatedProduct: Product) => {
          this.products = this.products.map((current) =>
            current.id === updatedProduct.id ? updatedProduct : current
          );
          // show success message
          this.resetState();
        },
        (error: HttpErrorResponse) => {
          console.log('error updating existing product: ', error);
        }
      );
  }

  // long workaround solution for saving columns state due to latest Clarity version bug
  @HostListener('window:click', ['$event'])
  onClick(event) {
    this.saveColumnsEvent(event);
  }

  private saveColumnsEvent = (event) => {
    const attr = event.target.attributes;
    const parent = objectGet(event.target, 'parentNode.parentNode.parentNode');
    const parentTwo = objectGet(event.target, 'parentNode.parentNode');

    if (!attr || !parent) {
      return;
    }

    const parentClassName = parent?.className?.split(' ')[0];
    const parentTwoClassName = parentTwo?.className?.split(' ')[1];
    const attrName = attr[0].name;
    const attrValue = attr[0].value;

    if (
      (attrName === 'shape' &&
        attrValue === 'close' &&
        parentClassName === 'column-switch') ||
      (attrName === 'shape' &&
        attrValue === 'view-columns' &&
        parentClassName === 'datagrid-footer' &&
        parentTwoClassName !== 'active')
    ) {
      const nameColumn = document.querySelector('.name-column');
      const descriptionColumn = document.querySelector('.description-column');
      const productNoColumn = document.querySelector('.product-no-column');
      const isArchivedColumn = document.querySelector('.is-archived-column');

      this.setColumnState(nameColumn, 'nameColumn');
      this.setColumnState(descriptionColumn, 'descriptionColumn');
      this.setColumnState(productNoColumn, 'productNoColumn');
      this.setColumnState(isArchivedColumn, 'isArchivedColumn');

      this.columnsStateManagerService.persistColumnsState(this.columnsState);
    }
  };

  private setColumnState(column: Element, columnName: string) {
    if (column) {
      if (column.classList.contains('datagrid-hidden-column')) {
        this.columnsState[columnName] = false;
      } else {
        this.columnsState[columnName] = true;
      }
    }
  }

  private resetState(): void {
    this.filteredProducts = [...this.products];
    this.totalRecords = this.filteredProducts.length;

    this.isEditDialogOpened = false;
    this.selectedProduct = null;
  }
}
