import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitationPaymentComponent } from './capitation-payment.component';

describe('CapitationPaymentComponent', () => {
  let component: CapitationPaymentComponent;
  let fixture: ComponentFixture<CapitationPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapitationPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitationPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
