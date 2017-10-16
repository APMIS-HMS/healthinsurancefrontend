import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationTopBarComponent } from './authorization-top-bar.component';

describe('AuthorizationTopBarComponent', () => {
  let component: AuthorizationTopBarComponent;
  let fixture: ComponentFixture<AuthorizationTopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizationTopBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
