import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { BillyMetaResponse } from 'src/app/contact/models/billy-meta-response.model';

import { ContactRepositoryService } from './contact-repository.service';
import { ContactsResponse } from '../models/contacts-response.model';
import { Contact } from '../models/contact.model';

describe('ContactRepositoryService', () => {
  let service: ContactRepositoryService;
  let httpTestingController: HttpTestingController;
  let baseUrl = 'http://localhost:3080/api/contacts';
  let contactsSampleResponse: ContactsResponse;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.get(HttpTestingController);
    contactsSampleResponse = {
      contacts: [new Contact({ id: '1', name: 'test contact' })],
      meta: {} as BillyMetaResponse,
    };
    service = TestBed.inject(ContactRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return data on successful request to all contacts', () => {
    let result: ContactsResponse;

    service.getContacts().subscribe((c) => {
      result = c;
    });
    const req = httpTestingController.expectOne({
      method: 'GET',
      url: baseUrl,
    });

    req.flush(contactsSampleResponse);

    expect(result).toEqual(contactsSampleResponse);
  });

  it('should throw error when network is down', () => {
    let error: string;
    service.getContacts().subscribe(null, (e) => {
      error = e;
    });

    let req = httpTestingController.expectOne(baseUrl);
    req.flush('Something went wrong', {
      status: 400,
      statusText: 'Network error',
    });

    expect(error.indexOf('Error retrieving contacts data') >= 0).toBeTruthy();
  });

  it('should call POST request to create a new product', () => {
    service.addContact(contactsSampleResponse.contacts[0]).subscribe();

    let req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/add-contact`,
    });
    expect(req.request.body).toEqual(contactsSampleResponse.contacts[0]);
  });

  it('should call PUT request to update an existing product', () => {
    const contact = contactsSampleResponse.contacts[0];
    service.updateContact(contact.id, contact).subscribe();

    let req = httpTestingController.expectOne({
      method: 'PUT',
      url: `${baseUrl}/update-contact/${contact.id}`,
    });
    expect(req.request.body).toEqual(contact);
  });
});
