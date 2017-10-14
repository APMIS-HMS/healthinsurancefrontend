import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalApproveClaimComponent } from './modal-approve-claim.component';

describe('ModalApproveClaimComponent', () => {
  let component: ModalApproveClaimComponent;
  let fixture: ComponentFixture<ModalApproveClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalApproveClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalApproveClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
