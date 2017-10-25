import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailBeneficiaryComponent } from './payment-detail-beneficiary.component';

describe('PaymentDetailBeneficiaryComponent', () => {
  let component: PaymentDetailBeneficiaryComponent;
  let fixture: ComponentFixture<PaymentDetailBeneficiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentDetailBeneficiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
