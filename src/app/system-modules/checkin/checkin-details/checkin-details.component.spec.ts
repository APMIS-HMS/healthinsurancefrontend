import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinDetailsComponent } from './checkin-details.component';

describe('CheckinDetailsComponent', () => {
  let component: CheckinDetailsComponent;
  let fixture: ComponentFixture<CheckinDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
