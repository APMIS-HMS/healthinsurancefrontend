import { TestBed, inject } from '@angular/core/testing';

import { ContactPositionService } from './contact-position.service';

describe('ContactPositionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactPositionService]
    });
  });

  it('should be created', inject([ContactPositionService], (service: ContactPositionService) => {
    expect(service).toBeTruthy();
  }));
});
