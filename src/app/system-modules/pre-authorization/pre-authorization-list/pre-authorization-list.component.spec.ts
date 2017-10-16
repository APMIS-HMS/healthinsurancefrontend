import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreAuthorizationListComponent } from './pre-authorization-list.component';

describe('PreAuthorizationListComponent', () => {
  let component: PreAuthorizationListComponent;
  let fixture: ComponentFixture<PreAuthorizationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreAuthorizationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreAuthorizationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
