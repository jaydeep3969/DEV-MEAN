import { TestBed } from '@angular/core/testing';

import { ItemsManagementService } from './items-management.service';

describe('ItemsManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ItemsManagementService = TestBed.get(ItemsManagementService);
    expect(service).toBeTruthy();
  });
});
