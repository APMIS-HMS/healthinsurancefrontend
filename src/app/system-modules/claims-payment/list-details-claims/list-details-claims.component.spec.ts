import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDetailsClaimsComponent } from './list-details-claims.component';

describe('ListDetailsClaimsComponent', () => {
  let component: ListDetailsClaimsComponent;
  let fixture: ComponentFixture<ListDetailsClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDetailsClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDetailsClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
