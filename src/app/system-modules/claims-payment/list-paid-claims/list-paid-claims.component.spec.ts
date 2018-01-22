import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaidClaimsComponent } from './list-paid-claims.component';

describe('ListPaidClaimsComponent', () => {
  let component: ListPaidClaimsComponent;
  let fixture: ComponentFixture<ListPaidClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPaidClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPaidClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
