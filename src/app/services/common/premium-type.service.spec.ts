import { TestBed, inject } from '@angular/core/testing';

import { PremiumTypeService } from './premium-type.service';

describe('PremiumTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PremiumTypeService]
    });
  });

  it('should be created', inject([PremiumTypeService], (service: PremiumTypeService) => {
    expect(service).toBeTruthy();
  }));
});
