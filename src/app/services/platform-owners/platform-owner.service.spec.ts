import { TestBed, inject } from '@angular/core/testing';

import { PlatformOwnerService } from './platform-owner.service';

describe('PlatformOwnerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlatformOwnerService]
    });
  });

  it('should be created', inject([PlatformOwnerService], (service: PlatformOwnerService) => {
    expect(service).toBeTruthy();
  }));
});
