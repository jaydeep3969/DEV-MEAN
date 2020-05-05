import { TestBed } from '@angular/core/testing';

import { OtherExpenseManagementService } from './other-expense-management.service';

describe('OtherExpenseManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OtherExpenseManagementService = TestBed.get(OtherExpenseManagementService);
    expect(service).toBeTruthy();
  });
});
