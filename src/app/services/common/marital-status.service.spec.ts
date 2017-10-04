import { TestBed, inject } from '@angular/core/testing';

import { MaritalStatusService } from './marital-status.service';

describe('MaritalStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaritalStatusService]
    });
  });

  it('should be created', inject([MaritalStatusService], (service: MaritalStatusService) => {
    expect(service).toBeTruthy();
  }));
});
