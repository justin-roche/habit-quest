import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekSchedulePage } from './week-schedule.page';

describe('WeekSchedulePage', () => {
  let component: WeekSchedulePage;
  let fixture: ComponentFixture<WeekSchedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekSchedulePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
