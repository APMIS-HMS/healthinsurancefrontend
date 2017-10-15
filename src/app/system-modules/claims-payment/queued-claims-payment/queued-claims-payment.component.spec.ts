import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueuedClaimsPaymentComponent } from './queued-claims-payment.component';

describe('QueuedClaimsPaymentComponent', () => {
  let component: QueuedClaimsPaymentComponent;
  let fixture: ComponentFixture<QueuedClaimsPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueuedClaimsPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueuedClaimsPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
