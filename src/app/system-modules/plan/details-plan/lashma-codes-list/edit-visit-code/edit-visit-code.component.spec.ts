import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVisitCodeComponent } from './edit-visit-code.component';

describe('EditVisitCodeComponent', () => {
  let component: EditVisitCodeComponent;
  let fixture: ComponentFixture<EditVisitCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVisitCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVisitCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
