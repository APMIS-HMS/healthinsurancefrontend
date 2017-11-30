import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHiaComponent } from './new-hia.component';

describe('NewHiaComponent', () => {
  let component: NewHiaComponent;
  let fixture: ComponentFixture<NewHiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewHiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewHiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
