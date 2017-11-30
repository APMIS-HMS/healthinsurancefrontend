import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferalTopBarComponent } from './referal-top-bar.component';

describe('ReferalTopBarComponent', () => {
  let component: ReferalTopBarComponent;
  let fixture: ComponentFixture<ReferalTopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferalTopBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferalTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
