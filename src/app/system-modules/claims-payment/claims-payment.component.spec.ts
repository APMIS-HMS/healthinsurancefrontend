import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsPaymentComponent } from './claims-payment.component';

describe('ClaimsPaymentComponent', () => {
  let component: ClaimsPaymentComponent;
  let fixture: ComponentFixture<ClaimsPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
