import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Contact } from '../models/contact.model';
import { ContactsResponse } from '../models/contacts-response.model';

@Injectable({
  providedIn: 'root',
})
export class ContactRepositoryService {
  // Node/Express API
  CONTACTS_API: string = 'http://localhost:3080/api/contacts';

  // Http Header
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) {}

  // Get all
  getContacts(): Observable<ContactsResponse> {
    return this.httpClient.get<ContactsResponse>(`${this.CONTACTS_API}`);
  }

  // Add
  addContact(data: Contact): Observable<unknown> {
    let API_URL = `${this.CONTACTS_API}/add-contact`;
    return this.httpClient
      .post(API_URL, data)
      .pipe(catchError(this.handleError));
  }

  // Get single object
  getContact(id: string): Observable<any> {
    let API_URL = `${this.CONTACTS_API}/contact/${id}`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders }).pipe(
      map((res: any) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  // Update
  updateContact(id: any, data: any): Observable<any> {
    let API_URL = `${this.CONTACTS_API}/update-contact/${id}`;
    return this.httpClient
      .put(API_URL, data, { headers: this.httpHeaders })
      .pipe(catchError(this.handleError));
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
