import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LashmaCodesComponent } from './lashma-codes.component';

describe('LashmaCodesComponent', () => {
  let component: LashmaCodesComponent;
  let fixture: ComponentFixture<LashmaCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LashmaCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LashmaCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
