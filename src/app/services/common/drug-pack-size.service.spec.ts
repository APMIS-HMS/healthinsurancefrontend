import { TestBed, inject } from '@angular/core/testing';

import { DrugPackSizeService } from './drug-pack-size.service';

describe('DrugPackSizeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrugPackSizeService]
    });
  });

  it('should be created', inject([DrugPackSizeService], (service: DrugPackSizeService) => {
    expect(service).toBeTruthy();
  }));
});
