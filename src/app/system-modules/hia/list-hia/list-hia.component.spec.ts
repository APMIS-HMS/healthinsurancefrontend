import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHiaComponent } from './list-hia.component';

describe('ListHiaComponent', () => {
  let component: ListHiaComponent;
  let fixture: ComponentFixture<ListHiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListHiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
