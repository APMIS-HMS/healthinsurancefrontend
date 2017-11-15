import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumPaymentTabComponent } from './premium-payment-tab.component';

describe('PremiumPaymentTabComponent', () => {
  let component: PremiumPaymentTabComponent;
  let fixture: ComponentFixture<PremiumPaymentTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumPaymentTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumPaymentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
