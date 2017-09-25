import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPlanComponent } from './details-plan.component';

describe('DetailsPlanComponent', () => {
  let component: DetailsPlanComponent;
  let fixture: ComponentFixture<DetailsPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
