import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBeneficiaryConfirmComponent } from './new-beneficiary-confirm.component';

describe('NewBeneficiaryConfirmComponent', () => {
  let component: NewBeneficiaryConfirmComponent;
  let fixture: ComponentFixture<NewBeneficiaryConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBeneficiaryConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBeneficiaryConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
