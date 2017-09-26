import { TestBed, inject } from '@angular/core/testing';

import { FacilityCategoryService } from './facility-category.service';

describe('FacilityCategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacilityCategoryService]
    });
  });

  it('should be created', inject([FacilityCategoryService], (service: FacilityCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
