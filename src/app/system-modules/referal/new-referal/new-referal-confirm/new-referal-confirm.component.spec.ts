import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReferalConfirmComponent } from './new-referal-confirm.component';

describe('NewReferalConfirmComponent', () => {
  let component: NewReferalConfirmComponent;
  let fixture: ComponentFixture<NewReferalConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewReferalConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReferalConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
