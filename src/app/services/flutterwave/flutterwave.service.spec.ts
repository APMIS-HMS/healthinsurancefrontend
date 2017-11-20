import { TestBed, inject } from '@angular/core/testing';

import { FlutterwaveService } from './flutterwave.service';

describe('FlutterwaveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlutterwaveService]
    });
  });

  it('should be created', inject([FlutterwaveService], (service: FlutterwaveService) => {
    expect(service).toBeTruthy();
  }));
});
