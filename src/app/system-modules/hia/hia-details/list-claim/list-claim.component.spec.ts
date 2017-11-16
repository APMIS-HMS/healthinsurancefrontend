import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClaimComponent } from './list-claim.component';

describe('ListClaimsComponent', () => {
  let component: ListClaimComponent;
  let fixture: ComponentFixture<ListClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});