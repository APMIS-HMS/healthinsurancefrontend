import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInvestigationCodeComponent } from './edit-investigation-code.component';

describe('EditInvestigationCodeComponent', () => {
  let component: EditInvestigationCodeComponent;
  let fixture: ComponentFixture<EditInvestigationCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInvestigationCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInvestigationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
