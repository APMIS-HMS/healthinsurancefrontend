import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinTopBarComponent } from './checkin-top-bar.component';

describe('CheckinTopBarComponent', () => {
  let component: CheckinTopBarComponent;
  let fixture: ComponentFixture<CheckinTopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinTopBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
