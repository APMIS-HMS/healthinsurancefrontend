import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryTopBarComponent } from './beneficiary-top-bar.component';

describe('BeneficiaryTopBarComponent', () => {
  let component: BeneficiaryTopBarComponent;
  let fixture: ComponentFixture<BeneficiaryTopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiaryTopBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
