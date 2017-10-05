import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabTopBarComponent } from './tab-top-bar.component';

describe('TabTopBarComponent', () => {
  let component: TabTopBarComponent;
  let fixture: ComponentFixture<TabTopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabTopBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
