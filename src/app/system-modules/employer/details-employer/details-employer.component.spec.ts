import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsEmployerComponent } from './details-employer.component';

describe('DetailsEmployerComponent', () => {
  let component: DetailsEmployerComponent;
  let fixture: ComponentFixture<DetailsEmployerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsEmployerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
