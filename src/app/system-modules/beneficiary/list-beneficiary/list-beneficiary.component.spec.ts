import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBeneficiaryComponent } from './list-beneficiary.component';

describe('ListBeneficiaryComponent', () => {
  let component: ListBeneficiaryComponent;
  let fixture: ComponentFixture<ListBeneficiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBeneficiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
