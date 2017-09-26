import { TestBed, inject } from '@angular/core/testing';

import { FacilityOwnershipService } from './facility-ownership.service';

describe('FacilityOwnershipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacilityOwnershipService]
    });
  });

  it('should be created', inject([FacilityOwnershipService], (service: FacilityOwnershipService) => {
    expect(service).toBeTruthy();
  }));
});
