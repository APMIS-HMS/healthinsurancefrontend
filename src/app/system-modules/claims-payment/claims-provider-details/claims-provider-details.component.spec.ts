import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsProviderDetailsComponent } from './claims-provider-details.component';

describe('ClaimsProviderDetailsComponent', () => {
  let component: ClaimsProviderDetailsComponent;
  let fixture: ComponentFixture<ClaimsProviderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsProviderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsProviderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
