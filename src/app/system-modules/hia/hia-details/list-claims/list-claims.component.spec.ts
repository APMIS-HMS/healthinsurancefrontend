import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClaimsComponent } from './list-claims.component';

describe('ListClaimsComponent', () => {
  let component: ListClaimsComponent;
  let fixture: ComponentFixture<ListClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
