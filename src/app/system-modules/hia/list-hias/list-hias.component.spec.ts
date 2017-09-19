import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHiasComponent } from './list-hias.component';

describe('ListHiasComponent', () => {
  let component: ListHiasComponent;
  let fixture: ComponentFixture<ListHiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListHiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
