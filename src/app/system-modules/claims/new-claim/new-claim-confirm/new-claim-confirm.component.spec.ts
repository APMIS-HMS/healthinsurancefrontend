import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewClaimConfirmComponent } from './new-claim-confirm.component';

describe('NewClaimConfirmComponent', () => {
  let component: NewClaimConfirmComponent;
  let fixture: ComponentFixture<NewClaimConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewClaimConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewClaimConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
