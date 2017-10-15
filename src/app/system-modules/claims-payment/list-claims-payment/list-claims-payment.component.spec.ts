import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClaimsPaymentComponent } from './list-claims-payment.component';

describe('ListClaimsPaymentComponent', () => {
  let component: ListClaimsPaymentComponent;
  let fixture: ComponentFixture<ListClaimsPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListClaimsPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClaimsPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
