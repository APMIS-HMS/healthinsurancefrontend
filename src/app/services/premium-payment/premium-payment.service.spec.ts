import { TestBed, inject } from '@angular/core/testing';

import { PremiumPaymentService } from './premium-payment.service';

describe('PremiumPaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PremiumPaymentService]
    });
  });

  it('should be created', inject([PremiumPaymentService], (service: PremiumPaymentService) => {
    expect(service).toBeTruthy();
  }));
});
