import { TestBed } from '@angular/core/testing';

import { B2bFilterService } from './b2b.filter.service';

describe('FilterService', () => {
  let service: B2bFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(B2bFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
