import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferalDetailTabComponent } from './referal-detail-tab.component';

describe('ReferalDetailTabComponent', () => {
  let component: ReferalDetailTabComponent;
  let fixture: ComponentFixture<ReferalDetailTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferalDetailTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferalDetailTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
