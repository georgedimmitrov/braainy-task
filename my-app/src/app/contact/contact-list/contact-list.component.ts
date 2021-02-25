import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ClrDatagrid, ClrDatagridColumn } from '@clr/angular';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Contact } from '../models/contact.model';
import { ContactsResponse } from '../models/contacts-response.model';
import { ContactRepositoryService } from '../services/contact-repository.service';
import {
  ContactGridColumnStateManagerService,
  ContactsGridColumnsState,
} from '../services/contact-grid-column-state-manager.service';
import { get as objectGet } from 'lodash';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[];
  filteredContacts: Contact[];
  selectedContact: Contact;
  columnsState: ContactsGridColumnsState;

  searchPhrase: string = '';

  isEditDialogOpened: boolean;
  isCreating: boolean;
  totalRecords: number;
  loading: boolean;

  destroy$: Subject<boolean> = new Subject<boolean>();

  columnHiddenChange(columnName: any, isHidden: boolean) {
    if (!this.loading) {
      // this solution works on older Clarity versions but was regressed and is now closed for some reason
      // https://github.com/vmware/clarity/issues/4227
      // this.columnsState[columnName] = !this.columnsState[columnName];
      // this.columnsStateManagerService.persistColumnsState(this.columnsState);
      // this.columnsState[columnName] = isHidden;
      // this.state.a = !this.state.a;
    }
  }

  constructor(
    private contactRepositoryService: ContactRepositoryService,
    private columnsStateManagerService: ContactGridColumnStateManagerService
  ) {}

  ngOnInit(): void {
    this.getAllContacts();
    this.columnsState = this.columnsStateManagerService.getColumnsState();
    this.isEditDialogOpened = false;
  }

  ngOnDestroy() {
    // a more optimized way is to call 'persistColumnsState' in ngOnDestroy but does not work when doing a page refresh
    // this.columnsStateManagerService.persistColumnsState(this.columnsState);

    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getAllContacts() {
    this.loading = true;

    this.contactRepositoryService
      .getContacts()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (contactsResponse: ContactsResponse) => {
          this.contacts = contactsResponse.contacts;
          this.filteredContacts = [...this.contacts];
          this.totalRecords = this.contacts.length;
        },
        (error: HttpErrorResponse) => {
          console.log('Could not get all contacts: ', error);
        }
      );
  }

  onAdd(): void {
    this.isCreating = true;
    this.selectedContact = new Contact();
    this.isEditDialogOpened = true;
  }

  onEdit(): void {
    this.isCreating = false;
    this.selectedContact = new Contact(this.selectedContact);
    this.isEditDialogOpened = true;
  }

  onEditDialogClose(): void {
    this.isEditDialogOpened = false;
    this.selectedContact = null;
  }

  onEditDialogSave(contact: Contact): void {
    if (this.isCreating) {
      this.create(contact);
    } else {
      this.update(contact);
    }
  }

  onSearchChange(search: string): void {
    const lowerCaseSearch = search.toLowerCase();
    this.filteredContacts = this.contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerCaseSearch) ||
        contact.countryId.toLowerCase().includes(lowerCaseSearch) ||
        contact.createdTime.toLowerCase().includes(lowerCaseSearch) ||
        contact.type.toLowerCase().includes(lowerCaseSearch)
    );
    this.totalRecords = this.filteredContacts.length;
  }

  disableEditButton(): boolean {
    return !this.selectedContact;
  }

  private create(contact: Contact): void {
    this.loading = true;
    this.contactRepositoryService
      .addContact(contact)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (savedContact: Contact) => {
          this.contacts.push(savedContact);
          // show success message
          this.resetState();
        },
        (error: HttpErrorResponse) => {
          console.log('error creating new contact: ', error);
        }
      );
  }

  private update(contact: Contact): void {
    this.loading = true;
    this.contactRepositoryService
      .updateContact(contact.id, contact)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (updatedContact: Contact) => {
          this.contacts = this.contacts.map((current) =>
            current.id === updatedContact.id ? updatedContact : current
          );
          // show success message
          this.resetState();
        },
        (error: HttpErrorResponse) => {
          console.log('error updating existing contact: ', error);
        }
      );
  }

  private resetState(): void {
    this.filteredContacts = [...this.contacts];
    this.totalRecords = this.filteredContacts.length;

    this.isEditDialogOpened = false;
    this.selectedContact = null;
  }

  // long workaround solution for saving columns state due to latest Clarity version bug
  @HostListener('window:click', ['$event'])
  onClick(event) {
    this.saveColumnsEvent(event);
  }

  saveColumnsEvent = (event) => {
    const attr = event.target.attributes;
    const parent = objectGet(event.target, 'parentNode.parentNode.parentNode');
    const parentTwo = objectGet(event.target, 'parentNode.parentNode');

    if (!attr || !parent) {
      return;
    }

    const parentClassName = parent.className.split(' ')[0];
    const parentTwoClassName = parentTwo.className.split(' ')[1];
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
      const countryColumn = document.querySelector('.country-column');
      const typeColumn = document.querySelector('.type-column');
      const createdColumn = document.querySelector('.created-column');

      this.setColumnState(nameColumn, 'nameColumn');
      this.setColumnState(countryColumn, 'countryColumn');
      this.setColumnState(typeColumn, 'typeColumn');
      this.setColumnState(createdColumn, 'createdColumn');

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
}
