import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsDetailTabComponent } from './claims-detail-tab.component';

describe('ClaimsDetailTabComponent', () => {
  let component: ClaimsDetailTabComponent;
  let fixture: ComponentFixture<ClaimsDetailTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsDetailTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsDetailTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
