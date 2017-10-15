import { TestBed, inject } from '@angular/core/testing';

import { ClaimsPaymentService } from './claims-payment.service';

describe('ClaimsPaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClaimsPaymentService]
    });
  });

  it('should be created', inject([ClaimsPaymentService], (service: ClaimsPaymentService) => {
    expect(service).toBeTruthy();
  }));
});
