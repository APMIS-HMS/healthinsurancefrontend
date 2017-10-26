import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProcedureCodeComponent } from './edit-procedure-code.component';

describe('EditProcedureCodeComponent', () => {
  let component: EditProcedureCodeComponent;
  let fixture: ComponentFixture<EditProcedureCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProcedureCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProcedureCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
