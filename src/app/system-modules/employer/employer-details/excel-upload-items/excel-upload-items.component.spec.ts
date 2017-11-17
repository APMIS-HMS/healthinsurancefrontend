import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelUploadItemsComponent } from './excel-upload-items.component';

describe('EmployerBeneficiariesComponent', () => {
  let component: ExcelUploadItemsComponent;
  let fixture: ComponentFixture<ExcelUploadItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelUploadItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelUploadItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
