import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalQueryClaimComponent } from './modal-query-claim.component';

describe('ModalQueryClaimComponent', () => {
  let component: ModalQueryClaimComponent;
  let fixture: ComponentFixture<ModalQueryClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalQueryClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalQueryClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
