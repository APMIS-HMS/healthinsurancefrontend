import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPreauthorizationsComponent } from './list-preauthorizations.component';

describe('ListPreauthorizationsComponent', () => {
  let component: ListPreauthorizationsComponent;
  let fixture: ComponentFixture<ListPreauthorizationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPreauthorizationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPreauthorizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
