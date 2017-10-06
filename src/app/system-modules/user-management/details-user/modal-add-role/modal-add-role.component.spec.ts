import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddRoleComponent } from './modal-add-role.component';

describe('ModalAddRoleComponent', () => {
  let component: ModalAddRoleComponent;
  let fixture: ComponentFixture<ModalAddRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
