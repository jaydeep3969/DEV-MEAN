import { TestBed } from '@angular/core/testing';

import { BillsManagementService } from './bills-management.service';

describe('BillsManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillsManagementService = TestBed.get(BillsManagementService);
    expect(service).toBeTruthy();
  });
});
