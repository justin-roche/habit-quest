import { TestBed } from '@angular/core/testing';

import { HabitsService } from './habits.service';

describe('HabitsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HabitsService = TestBed.get(HabitsService);
    expect(service).toBeTruthy();
  });
});
