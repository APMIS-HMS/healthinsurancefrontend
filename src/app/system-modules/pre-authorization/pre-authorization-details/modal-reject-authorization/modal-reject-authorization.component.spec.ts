import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRejectAuthorizationComponent } from './modal-reject-authorization.component';

describe('ModalRejectAuthorizationComponent', () => {
  let component: ModalRejectAuthorizationComponent;
  let fixture: ComponentFixture<ModalRejectAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRejectAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRejectAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
