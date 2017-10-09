import { TestBed, inject } from '@angular/core/testing';

import { ProviderStatusesService } from './provider-statuses.service';

describe('ProviderStatusesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProviderStatusesService]
    });
  });

  it('should be created', inject([ProviderStatusesService], (service: ProviderStatusesService) => {
    expect(service).toBeTruthy();
  }));
});
