import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationDetailsTabComponent } from './authorization-details-tab.component';

describe('AuthorizationDetailsTabComponent', () => {
  let component: AuthorizationDetailsTabComponent;
  let fixture: ComponentFixture<AuthorizationDetailsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizationDetailsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
