import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreAuthorizationNewComponent } from './pre-authorization-new.component';

describe('PreAuthorizationNewComponent', () => {
  let component: PreAuthorizationNewComponent;
  let fixture: ComponentFixture<PreAuthorizationNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreAuthorizationNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreAuthorizationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
