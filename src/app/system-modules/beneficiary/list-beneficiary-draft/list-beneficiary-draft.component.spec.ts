import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBeneficiaryDraftComponent } from './list-beneficiary-draft.component';

describe('ListBeneficiaryDraftComponent', () => {
  let component: ListBeneficiaryDraftComponent;
  let fixture: ComponentFixture<ListBeneficiaryDraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBeneficiaryDraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBeneficiaryDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
