import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBeneficiaryDependantComponent } from './new-beneficiary-dependant.component';

describe('NewBeneficiaryDependantComponent', () => {
  let component: NewBeneficiaryDependantComponent;
  let fixture: ComponentFixture<NewBeneficiaryDependantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBeneficiaryDependantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBeneficiaryDependantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
