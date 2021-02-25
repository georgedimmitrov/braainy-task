import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';
import { blankProduct, invalidProduct, validProduct } from '../mocks';
import { Product } from '../models/product.model';

import { ProductListEditDialogComponent } from './product-list-edit-dialog.component';

describe('ProductListEditDialogComponent', () => {
  let component: ProductListEditDialogComponent;
  let fixture: ComponentFixture<ProductListEditDialogComponent>;
  let element: HTMLElement;
  let sampleProduct = new Product({
    id: '1',
    name: 'test product name',
    description: 'test product description',
    isArchived: false,
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListEditDialogComponent],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule, ClarityModule, NoopAnimationsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListEditDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = Object.assign({}, sampleProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Dialog form validation', () => {
    it('Should not allow blank product name', () => {
      component.name.setValue(blankProduct.name);
      const errs = component.name.errors;
      expect(errs).toEqual({ required: true });
    });

    it('Should not allow product name longer than 100 characters', () => {
      component.name.setValue(invalidProduct.name);
      const errs = component.name.errors;
      expect(errs).toEqual({
        maxlength: { requiredLength: 100, actualLength: 950 },
      });
    });

    it('Should not allow blank product description', () => {
      component.description.setValue(blankProduct.description);
      const errs = component.description.errors;
      expect(errs).toEqual({ required: true });
    });

    it('Should not allow product description longer than 255 characters', () => {
      component.description.setValue(invalidProduct.description);
      const errs = component.description.errors;
      expect(errs).toEqual({
        maxlength: { requiredLength: 255, actualLength: 1300 },
      });
    });

    it('product model should be updated from form changes after save is clicked', fakeAsync(() => {
      const testProduct = {
        ...sampleProduct,
        name: 'updated name',
        description: 'updated description',
        isArchived: false,
      };
      component.name.setValue(testProduct.name);
      component.description.setValue(testProduct.description);
      component.save();
      expect(component.product).toEqual(testProduct);
    }));

    it('isValid should be false when form is invalid', fakeAsync(() => {
      updateForm(
        invalidProduct.name,
        invalidProduct.description,
        invalidProduct.isArchived
      );
      expect(component.productForm.valid).toBeFalsy();
    }));

    function updateForm(
      name: string,
      description: string,
      isArchived: boolean
    ) {
      component.name.setValue(name);
      component.description.setValue(description);
      component.isArchived.setValue(isArchived);
    }
  });
});
