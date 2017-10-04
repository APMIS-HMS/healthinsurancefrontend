import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformOwnerComponent } from './platform-owner.component';

describe('PlatformOwnerComponent', () => {
  let component: PlatformOwnerComponent;
  let fixture: ComponentFixture<PlatformOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
