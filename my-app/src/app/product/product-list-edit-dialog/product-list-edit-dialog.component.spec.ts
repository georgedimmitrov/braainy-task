import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListEditDialogComponent } from './product-list-edit-dialog.component';

describe('ProductListEditDialogComponent', () => {
  let component: ProductListEditDialogComponent;
  let fixture: ComponentFixture<ProductListEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductListEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
