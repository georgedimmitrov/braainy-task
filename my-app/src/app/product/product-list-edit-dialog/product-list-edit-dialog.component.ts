import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../models/product.model';

type ProductFormFields = {
  name: string;
  description: string;
  productNo: string;
  isArchived: boolean;
};

@Component({
  selector: 'app-product-list-edit-dialog',
  templateUrl: './product-list-edit-dialog.component.html',
  styleUrls: ['./product-list-edit-dialog.component.scss'],
})
export class ProductListEditDialogComponent implements OnInit {
  @Input() isCreating: boolean;
  @Input() product: Product;

  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSave: EventEmitter<Product> = new EventEmitter<Product>();

  availableStatuses: boolean[] = [false, true];

  isOpen: boolean = true;
  productForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: this.formBuilder.control(this.product.name, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      description: this.formBuilder.control(this.product.description, [
        Validators.required,
        Validators.maxLength(255),
      ]),
      isArchived: this.formBuilder.control(this.product.isArchived),
    });
  }

  save(): void {
    if (this.productForm.invalid) {
      this.productForm.markAsTouched();
    } else {
      this.updateProductFromFormFields(this.productForm.getRawValue());
      this.onSave.emit(this.product);
    }
  }

  close(): void {
    this.onClose.emit();
    this.productForm.reset();
  }

  onOpenChange(): void {
    if (this.isOpen) {
      this.close();
    }
  }

  private updateProductFromFormFields(
    productFormFields: ProductFormFields
  ): void {
    this.product.name = productFormFields.name;
    this.product.description = productFormFields.description;
    this.product.isArchived = productFormFields.isArchived;
  }

  get isArchived() {
    return this.productForm.get('isArchived');
  }
}
