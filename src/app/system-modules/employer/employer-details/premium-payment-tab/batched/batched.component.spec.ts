import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchedComponent } from './batched.component';

describe('BatchedComponent', () => {
  let component: BatchedComponent;
  let fixture: ComponentFixture<BatchedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
