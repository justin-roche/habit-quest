import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlePage } from './battle.page';

describe('BattlePage', () => {
  let component: BattlePage;
  let fixture: ComponentFixture<BattlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattlePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
