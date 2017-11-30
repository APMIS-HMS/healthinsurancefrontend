import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRejectReferalComponent } from './modal-reject-referal.component';

describe('ModalRejectReferalComponent', () => {
  let component: ModalRejectReferalComponent;
  let fixture: ComponentFixture<ModalRejectReferalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRejectReferalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRejectReferalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
