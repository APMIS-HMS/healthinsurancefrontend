import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDrugCodeComponent } from './edit-drug-code.component';

describe('EditDrugCodeComponent', () => {
  let component: EditDrugCodeComponent;
  let fixture: ComponentFixture<EditDrugCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDrugCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDrugCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
