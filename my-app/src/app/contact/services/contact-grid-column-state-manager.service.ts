import { Injectable } from '@angular/core';

export interface ContactsGridColumnsState {
  nameColumn: boolean;
  countryColumn: boolean;
  typeColumn: boolean;
  createdColumn: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ContactGridColumnStateManagerService {
  private readonly localStorageKey = 'contacts-grid-column-state';

  constructor() {}

  getColumnsState(): ContactsGridColumnsState {
    const localStorageItem = localStorage.getItem(this.localStorageKey);
    if (localStorage && localStorage.length > 0) {
      return JSON.parse(localStorageItem);
    } else {
      const initialState = this.getInitialColumnsState();
      localStorage.setItem(this.localStorageKey, JSON.stringify(initialState));
      return initialState;
    }
  }

  persistColumnsState(columnsState: ContactsGridColumnsState) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(columnsState));
  }

  private getInitialColumnsState(): ContactsGridColumnsState {
    return {
      nameColumn: true,
      countryColumn: true,
      typeColumn: true,
      createdColumn: true,
    };
  }
}
