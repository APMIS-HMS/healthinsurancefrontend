import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiaComponent } from './hia.component';

describe('HiaComponent', () => {
  let component: HiaComponent;
  let fixture: ComponentFixture<HiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
