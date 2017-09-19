import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsBeneficiaryComponent } from './details-beneficiary.component';

describe('DetailsBeneficiaryComponent', () => {
  let component: DetailsBeneficiaryComponent;
  let fixture: ComponentFixture<DetailsBeneficiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsBeneficiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
