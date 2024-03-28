import { TestBed } from '@angular/core/testing';

import { MeasureUnitService } from './measure-unit.service';

describe('MeasureUnitService', () => {
  let service: MeasureUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasureUnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
