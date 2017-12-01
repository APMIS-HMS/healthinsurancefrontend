import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReferralsComponent } from './list-referrals.component';

describe('ListReferralsComponent', () => {
  let component: ListReferralsComponent;
  let fixture: ComponentFixture<ListReferralsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListReferralsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReferralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
