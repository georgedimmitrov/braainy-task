import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { Contact } from '../models/contact.model';

type ContactFormFields = { name: string; countryId: string; type: string };

@Component({
  selector: 'app-contact-list-edit-dialog',
  templateUrl: './contact-list-edit-dialog.component.html',
  styleUrls: ['./contact-list-edit-dialog.component.scss'],
})
export class ContactListEditDialogComponent implements OnInit {
  isOpen: boolean = true;

  @Input() isCreating: boolean;

  @Input() contact: Contact;

  // private _contact: Contact;

  // @Input('contact') set contact(contact: Contact) {
  //   this._contact = contact;
  //   if (this.contactForm) {
  //     this.contactForm.setValue(this.getContactFormControlsValues());
  //   }
  // }

  // get contact(): Contact {
  //   return this._contact;
  // }

  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSave: EventEmitter<Contact> = new EventEmitter<Contact>();

  // @ViewChild('form') form: NgForm;

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
        Validators.maxLength(30),
      ]),
      type: this.formBuilder.control(this.contact.type, [
        Validators.required,
        Validators.maxLength(50),
      ]),
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
    // this.contactForm.setValue(this.getDefaultModuleFormControlsValues());
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

  // private getContactFormControlsValues(): DefaultModuleFormFields {
  //   return {
  //     name: this.conta.getName(),
  //     description: this.defaultModule.getDescription(),
  //     active: this.defaultModule.getActive(),
  //   };
  // }
}
