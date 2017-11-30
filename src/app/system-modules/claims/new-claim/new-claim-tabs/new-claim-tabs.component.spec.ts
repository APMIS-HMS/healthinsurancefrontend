import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewClaimTabsComponent } from './new-claim-tabs.component';

describe('NewClaimTabsComponent', () => {
  let component: NewClaimTabsComponent;
  let fixture: ComponentFixture<NewClaimTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewClaimTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewClaimTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
