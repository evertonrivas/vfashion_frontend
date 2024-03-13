import { TestBed } from '@angular/core/testing';

import { SysFilterService } from './sys.filter.service';

describe('FilterService', () => {
  let service: SysFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SysFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
