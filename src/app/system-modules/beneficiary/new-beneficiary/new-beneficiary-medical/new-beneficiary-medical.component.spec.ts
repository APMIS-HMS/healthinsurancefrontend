import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBeneficiaryMedicalComponent } from './new-beneficiary-medical.component';

describe('NewBeneficiaryMedicalComponent', () => {
  let component: NewBeneficiaryMedicalComponent;
  let fixture: ComponentFixture<NewBeneficiaryMedicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBeneficiaryMedicalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBeneficiaryMedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
