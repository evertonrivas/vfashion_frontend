import { TestBed } from '@angular/core/testing';

import { B2bReturnService } from './b2b.return.service';

describe('B2bReturnService', () => {
  let service: B2bReturnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(B2bReturnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
