import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReferalsComponent } from './list-referals.component';

describe('ListReferalsComponent', () => {
  let component: ListReferalsComponent;
  let fixture: ComponentFixture<ListReferalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListReferalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReferalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
