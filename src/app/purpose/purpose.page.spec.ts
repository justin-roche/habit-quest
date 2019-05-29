import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurposePage } from './purpose.page';

describe('PurposePage', () => {
  let component: PurposePage;
  let fixture: ComponentFixture<PurposePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurposePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurposePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
