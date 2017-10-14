import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsTopBarComponent } from './claims-top-bar.component';

describe('ClaimsTopBarComponent', () => {
  let component: ClaimsTopBarComponent;
  let fixture: ComponentFixture<ClaimsTopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsTopBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
