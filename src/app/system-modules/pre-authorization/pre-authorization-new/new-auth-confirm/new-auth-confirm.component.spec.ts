import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAuthConfirmComponent } from './new-auth-confirm.component';

describe('NewAuthConfirmComponent', () => {
  let component: NewAuthConfirmComponent;
  let fixture: ComponentFixture<NewAuthConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAuthConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAuthConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
