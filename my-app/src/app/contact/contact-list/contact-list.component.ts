import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Contact } from '../models/contact.model';
import { ContactsResponse } from '../models/contacts-response.model';
import { ContactRepositoryService } from '../services/contact-repository.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private contactRepositoryService: ContactRepositoryService) {}

  ngOnInit(): void {
    this.getAllContacts();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getAllContacts() {
    this.contactRepositoryService
      .getContacts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((contactsResponse: ContactsResponse) => {
        this.contacts = contactsResponse.contacts;
      });
  }
}
