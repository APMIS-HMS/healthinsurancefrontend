import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHoldAuthorizationComponent } from './modal-hold-authorization.component';

describe('ModalHoldAuthorizationComponent', () => {
  let component: ModalHoldAuthorizationComponent;
  let fixture: ComponentFixture<ModalHoldAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalHoldAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalHoldAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
