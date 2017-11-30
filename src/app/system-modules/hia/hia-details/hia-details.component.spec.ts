import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiaDetailsComponent } from './hia-details.component';

describe('HiaDetailsComponent', () => {
  let component: HiaDetailsComponent;
  let fixture: ComponentFixture<HiaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
