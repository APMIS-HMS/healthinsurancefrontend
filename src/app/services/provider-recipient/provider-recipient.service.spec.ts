import { TestBed, inject } from '@angular/core/testing';

import { ProviderRecipientService } from './provider-recipient.service';

describe('ProviderRecipientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProviderRecipientService]
    });
  });

  it('should be created', inject([ProviderRecipientService], (service: ProviderRecipientService) => {
    expect(service).toBeTruthy();
  }));
});
