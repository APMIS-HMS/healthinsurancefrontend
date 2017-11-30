import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPreauthTabsComponent } from './new-preauth-tabs.component';

describe('NewPreauthTabsComponent', () => {
  let component: NewPreauthTabsComponent;
  let fixture: ComponentFixture<NewPreauthTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPreauthTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPreauthTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
