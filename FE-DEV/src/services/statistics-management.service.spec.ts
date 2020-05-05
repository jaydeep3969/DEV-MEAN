import { TestBed } from '@angular/core/testing';

import { StatisticsManagementService } from './statistics-management.service';

describe('StatisticsManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatisticsManagementService = TestBed.get(StatisticsManagementService);
    expect(service).toBeTruthy();
  });
});
