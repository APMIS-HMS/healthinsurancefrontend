import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmployerComponent } from './new-employer.component';

describe('NewEmployerComponent', () => {
  let component: NewEmployerComponent;
  let fixture: ComponentFixture<NewEmployerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEmployerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
