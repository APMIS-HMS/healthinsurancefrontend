import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddOrganizationPaymentComponent } from './modal-add-organization-payment.component';

describe('ModalAddOrganizationPaymentComponent', () => {
  let component: ModalAddOrganizationPaymentComponent;
  let fixture: ComponentFixture<ModalAddOrganizationPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddOrganizationPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddOrganizationPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
