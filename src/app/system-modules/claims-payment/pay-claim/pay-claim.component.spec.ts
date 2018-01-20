import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayClaimComponent } from './pay-claim.component';

describe('PayClaimComponent', () => {
  let component: PayClaimComponent;
  let fixture: ComponentFixture<PayClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
