import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferalDetailsComponent } from './referal-details.component';

describe('ReferalDetailsComponent', () => {
  let component: ReferalDetailsComponent;
  let fixture: ComponentFixture<ReferalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
