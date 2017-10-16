import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationOthersTabComponent } from './authorization-others-tab.component';

describe('AuthorizationOthersTabComponent', () => {
  let component: AuthorizationOthersTabComponent;
  let fixture: ComponentFixture<AuthorizationOthersTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizationOthersTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationOthersTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
