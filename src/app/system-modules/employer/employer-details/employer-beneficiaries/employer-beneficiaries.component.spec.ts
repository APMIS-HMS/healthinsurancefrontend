import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerBeneficiariesComponent } from './employer-beneficiaries.component';

describe('EmployerBeneficiariesComponent', () => {
  let component: EmployerBeneficiariesComponent;
  let fixture: ComponentFixture<EmployerBeneficiariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerBeneficiariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerBeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
