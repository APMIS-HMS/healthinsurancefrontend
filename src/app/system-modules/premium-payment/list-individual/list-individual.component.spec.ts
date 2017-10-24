import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIndividualComponent } from './list-individual.component';

describe('ListIndividualComponent', () => {
  let component: ListIndividualComponent;
  let fixture: ComponentFixture<ListIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
