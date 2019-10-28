import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreakChartComponent } from './streak-chart.component';

describe('StreakChartComponent', () => {
  let component: StreakChartComponent;
  let fixture: ComponentFixture<StreakChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreakChartComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreakChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
