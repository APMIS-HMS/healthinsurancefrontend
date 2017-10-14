import { TestBed, inject } from '@angular/core/testing';

import { EncounterStatusService } from './encounter-status.service';

describe('EncounterStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EncounterStatusService]
    });
  });

  it('should be created', inject([EncounterStatusService], (service: EncounterStatusService) => {
    expect(service).toBeTruthy();
  }));
});
