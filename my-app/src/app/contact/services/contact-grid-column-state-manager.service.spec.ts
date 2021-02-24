import { TestBed } from '@angular/core/testing';

import { ContactGridColumnStateManagerService } from './contact-grid-column-state-manager.service';

describe('ContactGridColumnStateManagerService', () => {
  let service: ContactGridColumnStateManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactGridColumnStateManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
