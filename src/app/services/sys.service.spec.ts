import { TestBed } from '@angular/core/testing';

import { SysService } from './sys.service';

describe('SysService', () => {
  let service: SysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
