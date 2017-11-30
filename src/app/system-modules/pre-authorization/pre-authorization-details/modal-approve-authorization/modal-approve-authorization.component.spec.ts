import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalApproveAuthorizationComponent } from './modal-approve-authorization.component';

describe('ModalApproveAuthorizationComponent', () => {
  let component: ModalApproveAuthorizationComponent;
  let fixture: ComponentFixture<ModalApproveAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalApproveAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalApproveAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
