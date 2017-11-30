import { TestBed, inject } from '@angular/core/testing';

import { ProviderGradesService } from './provider-grades.service';

describe('ProviderGradesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProviderGradesService]
    });
  });

  it('should be created', inject([ProviderGradesService], (service: ProviderGradesService) => {
    expect(service).toBeTruthy();
  }));
});
