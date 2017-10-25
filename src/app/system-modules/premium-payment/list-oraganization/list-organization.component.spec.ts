import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmployerComponent } from './list-employer.component';

describe('ListEmployerComponent', () => {
  let component: ListEmployerComponent;
  let fixture: ComponentFixture<ListEmployerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
