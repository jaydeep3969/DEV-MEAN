import { TestBed } from '@angular/core/testing';

import { CustomerManagementService } from './customer-management.service';

describe('CustomerManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerManagementService = TestBed.get(CustomerManagementService);
    expect(service).toBeTruthy();
  });
});
