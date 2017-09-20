import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPlatformComponent } from './details-platform.component';

describe('DetailsPlatformComponent', () => {
  let component: DetailsPlatformComponent;
  let fixture: ComponentFixture<DetailsPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
