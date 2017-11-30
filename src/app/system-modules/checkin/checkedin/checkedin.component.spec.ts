import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckedinComponent } from './checkedin.component';

describe('CheckedinComponent', () => {
  let component: CheckedinComponent;
  let fixture: ComponentFixture<CheckedinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckedinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckedinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
