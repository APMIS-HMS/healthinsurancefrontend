import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumPaymentComponent } from './premium-payment.component';

describe('PremiumPaymentComponent', () => {
  let component: PremiumPaymentComponent;
  let fixture: ComponentFixture<PremiumPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
