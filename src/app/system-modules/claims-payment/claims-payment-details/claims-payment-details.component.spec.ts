import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsPaymentDetailsComponent } from './claims-payment-details.component';

describe('ClaimsPaymentDetailsComponent', () => {
  let component: ClaimsPaymentDetailsComponent;
  let fixture: ComponentFixture<ClaimsPaymentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsPaymentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
