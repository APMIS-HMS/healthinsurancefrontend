import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBeneficiaryProgramComponent } from './new-beneficiary-program.component';

describe('NewBeneficiaryProgramComponent', () => {
  let component: NewBeneficiaryProgramComponent;
  let fixture: ComponentFixture<NewBeneficiaryProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBeneficiaryProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBeneficiaryProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
