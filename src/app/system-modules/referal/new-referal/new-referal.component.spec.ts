import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReferalComponent } from './new-referal.component';

describe('NewReferalComponent', () => {
  let component: NewReferalComponent;
  let fixture: ComponentFixture<NewReferalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewReferalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReferalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
