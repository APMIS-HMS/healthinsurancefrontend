import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHoldClaimComponent } from './modal-hold-claim.component';

describe('ModalHoldClaimComponent', () => {
  let component: ModalHoldClaimComponent;
  let fixture: ComponentFixture<ModalHoldClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalHoldClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalHoldClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
