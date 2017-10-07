import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerTopBarComponent } from './employer-top-bar.component';

describe('EmployerTopBarComponent', () => {
  let component: EmployerTopBarComponent;
  let fixture: ComponentFixture<EmployerTopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerTopBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
