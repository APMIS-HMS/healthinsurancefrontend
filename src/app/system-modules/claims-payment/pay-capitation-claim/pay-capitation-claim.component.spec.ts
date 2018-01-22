import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayCapitationClaimComponent } from './pay-capitation-claim.component';

describe('PayCapitationClaimComponent', () => {
  let component: PayCapitationClaimComponent;
  let fixture: ComponentFixture<PayCapitationClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayCapitationClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayCapitationClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
