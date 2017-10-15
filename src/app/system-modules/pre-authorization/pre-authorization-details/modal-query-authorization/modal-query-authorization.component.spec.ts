import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalQueryAuthorizationComponent } from './modal-query-authorization.component';

describe('ModalQueryAuthorizationComponent', () => {
  let component: ModalQueryAuthorizationComponent;
  let fixture: ComponentFixture<ModalQueryAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalQueryAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalQueryAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
