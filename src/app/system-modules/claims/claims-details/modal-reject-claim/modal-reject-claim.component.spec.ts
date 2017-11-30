import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRejectClaimComponent } from './modal-reject-claim.component';

describe('ModalRejectClaimComponent', () => {
  let component: ModalRejectClaimComponent;
  let fixture: ComponentFixture<ModalRejectClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRejectClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRejectClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
