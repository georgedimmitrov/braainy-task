import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { Contact, availableCountryCodes } from '../models/contact.model';

type ContactFormFields = { name: string; countryId: string; type: string };

@Component({
  selector: 'app-contact-list-edit-dialog',
  templateUrl: './contact-list-edit-dialog.component.html',
  styleUrls: ['./contact-list-edit-dialog.component.scss'],
})
export class ContactListEditDialogComponent implements OnInit {
  @Input() isCreating: boolean;
  @Input() contact: Contact;

  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSave: EventEmitter<Contact> = new EventEmitter<Contact>();

  availableTypes: string[] = ['person', 'company'];
  availableCountries: string[] = availableCountryCodes;

  isOpen: boolean = true;
  contactForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: this.formBuilder.control(this.contact.name, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      countryId: this.formBuilder.control(this.contact.countryId, [
        Validators.required,
      ]),
      type: this.formBuilder.control(this.contact.type, [Validators.required]),
    });
  }

  save(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAsTouched();
    } else {
      this.updateContactFromFormFields(this.contactForm.getRawValue());
      this.onSave.emit(this.contact);
    }
  }

  close(): void {
    this.onClose.emit();
    this.contactForm.reset();
  }

  onOpenChange(): void {
    if (this.isOpen) {
      this.close();
    }
  }

  private updateContactFromFormFields(
    contactFormFields: ContactFormFields
  ): void {
    this.contact.name = contactFormFields.name;
    this.contact.countryId = contactFormFields.countryId;
    this.contact.type = contactFormFields.type;
  }

  get countryId() {
    return this.contactForm.get('countryId');
  }

  get type() {
    return this.contactForm.get('type');
  }
}
