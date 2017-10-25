import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmployeePaymentComponent } from './new-employee-payment.component';

describe('NewEmployeePaymentComponent', () => {
  let component: NewEmployeePaymentComponent;
  let fixture: ComponentFixture<NewEmployeePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEmployeePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEmployeePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
