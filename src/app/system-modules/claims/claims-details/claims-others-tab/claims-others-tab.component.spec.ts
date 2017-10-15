import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsOthersTabComponent } from './claims-others-tab.component';

describe('ClaimsOthersTabComponent', () => {
  let component: ClaimsOthersTabComponent;
  let fixture: ComponentFixture<ClaimsOthersTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsOthersTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsOthersTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
