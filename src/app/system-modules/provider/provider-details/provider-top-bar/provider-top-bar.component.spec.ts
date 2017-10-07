import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderTopBarComponent } from './provider-top-bar.component';

describe('ProviderTopBarComponent', () => {
  let component: ProviderTopBarComponent;
  let fixture: ComponentFixture<ProviderTopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderTopBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
