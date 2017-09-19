import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsHiaComponent } from './details-hia.component';

describe('DetailsHiaComponent', () => {
  let component: DetailsHiaComponent;
  let fixture: ComponentFixture<DetailsHiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsHiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsHiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
