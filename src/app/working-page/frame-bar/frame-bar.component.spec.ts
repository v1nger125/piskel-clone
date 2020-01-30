import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameBarComponent } from './frame-bar.component';

describe('FrameBarComponent', () => {
  let component: FrameBarComponent;
  let fixture: ComponentFixture<FrameBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
