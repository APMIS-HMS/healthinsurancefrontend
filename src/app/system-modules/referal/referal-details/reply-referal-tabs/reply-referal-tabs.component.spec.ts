import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyReferalTabsComponent } from './reply-referal-tabs.component';

describe('ReplyReferalTabsComponent', () => {
  let component: ReplyReferalTabsComponent;
  let fixture: ComponentFixture<ReplyReferalTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplyReferalTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyReferalTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
