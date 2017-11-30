import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBeneficiaryNokComponent } from './new-beneficiary-nok.component';

describe('NewBeneficiaryNokComponent', () => {
  let component: NewBeneficiaryNokComponent;
  let fixture: ComponentFixture<NewBeneficiaryNokComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBeneficiaryNokComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBeneficiaryNokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
