import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LashmaCodesListComponent } from './lashma-codes-list.component';

describe('LashmaCodesListComponent', () => {
  let component: LashmaCodesListComponent;
  let fixture: ComponentFixture<LashmaCodesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LashmaCodesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LashmaCodesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
