import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBeneficiaryDataComponent } from './new-beneficiary-data.component';

describe('NewBeneficiaryDataComponent', () => {
  let component: NewBeneficiaryDataComponent;
  let fixture: ComponentFixture<NewBeneficiaryDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBeneficiaryDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBeneficiaryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
