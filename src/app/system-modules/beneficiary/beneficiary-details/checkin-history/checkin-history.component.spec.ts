import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinHistoryComponent } from './checkin-history.component';

describe('CheckinHistoryComponent', () => {
  let component: CheckinHistoryComponent;
  let fixture: ComponentFixture<CheckinHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
