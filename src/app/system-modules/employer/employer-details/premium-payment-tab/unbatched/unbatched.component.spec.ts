import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnbatchedComponent } from './unbatched.component';

describe('UnbatchedComponent', () => {
  let component: UnbatchedComponent;
  let fixture: ComponentFixture<UnbatchedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnbatchedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnbatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
