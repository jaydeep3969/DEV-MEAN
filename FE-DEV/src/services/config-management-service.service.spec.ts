import { TestBed } from '@angular/core/testing';

import { ConfigManagementServiceService } from './config-management-service.service';

describe('ConfigManagementServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigManagementServiceService = TestBed.get(ConfigManagementServiceService);
    expect(service).toBeTruthy();
  });
});
