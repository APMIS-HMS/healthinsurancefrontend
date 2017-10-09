import { TestBed, inject } from '@angular/core/testing';

import { HiaGradeService } from './hia-grade.service';

describe('HiaGradeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HiaGradeService]
    });
  });

  it('should be created', inject([HiaGradeService], (service: HiaGradeService) => {
    expect(service).toBeTruthy();
  }));
});
