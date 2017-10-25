import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentModeComponent } from './modal-payment-mode.component';

describe('ModalPaymentModeComponent', () => {
  let component: ModalPaymentModeComponent;
  let fixture: ComponentFixture<ModalPaymentModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPaymentModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPaymentModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
