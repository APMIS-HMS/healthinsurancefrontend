import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinDetailsGenerateComponent } from './checkin-details-generate.component';

describe('CheckinDetailsGenerateComponent', () => {
  let component: CheckinDetailsGenerateComponent;
  let fixture: ComponentFixture<CheckinDetailsGenerateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckinDetailsGenerateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinDetailsGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
