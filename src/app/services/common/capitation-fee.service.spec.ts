import { TestBed, inject } from '@angular/core/testing';

import { CapitationFeeService } from './capitation-fee.service';

describe('CapitationFeeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CapitationFeeService]
    });
  });

  it('should be created', inject([CapitationFeeService], (service: CapitationFeeService) => {
    expect(service).toBeTruthy();
  }));
});
