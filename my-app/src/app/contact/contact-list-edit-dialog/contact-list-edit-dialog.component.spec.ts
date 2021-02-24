import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactListEditDialogComponent } from './contact-list-edit-dialog.component';

describe('ContactListEditDialogComponent', () => {
  let component: ContactListEditDialogComponent;
  let fixture: ComponentFixture<ContactListEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactListEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
