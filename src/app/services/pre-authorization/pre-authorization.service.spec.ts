import { TestBed, inject } from '@angular/core/testing';

import { PreAuthorizationService } from './pre-authorization.service';

describe('PreAuthorizationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreAuthorizationService]
    });
  });

  it('should be created', inject([PreAuthorizationService], (service: PreAuthorizationService) => {
    expect(service).toBeTruthy();
  }));
});
