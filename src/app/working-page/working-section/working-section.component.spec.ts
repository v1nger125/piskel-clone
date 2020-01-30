import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingSectionComponent } from './working-section.component';

describe('WorkingSectionComponent', () => {
  let component: WorkingSectionComponent;
  let fixture: ComponentFixture<WorkingSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
