import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalApproveReferalComponent } from './modal-approve-referal.component';

describe('ModalApproveReferalComponent', () => {
  let component: ModalApproveReferalComponent;
  let fixture: ComponentFixture<ModalApproveReferalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalApproveReferalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalApproveReferalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
