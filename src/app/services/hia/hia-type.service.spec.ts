import { TestBed, inject } from '@angular/core/testing';

import { HiaTypeService } from './hia-type.service';

describe('HiaTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HiaTypeService]
    });
  });

  it('should be created', inject([HiaTypeService], (service: HiaTypeService) => {
    expect(service).toBeTruthy();
  }));
});
