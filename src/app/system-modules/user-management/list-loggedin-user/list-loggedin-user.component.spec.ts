import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLoggedInUserComponent } from './list-loggedin-user.component';

describe('ListLoggedInUserComponent', () => {
  let component: ListLoggedInUserComponent;
  let fixture: ComponentFixture<ListLoggedInUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLoggedInUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLoggedInUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
