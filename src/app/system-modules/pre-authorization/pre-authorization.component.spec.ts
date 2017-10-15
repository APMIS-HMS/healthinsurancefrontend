import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreAuthorizationComponent } from './pre-authorization.component';

describe('PreAuthorizationComponent', () => {
  let component: PreAuthorizationComponent;
  let fixture: ComponentFixture<PreAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
