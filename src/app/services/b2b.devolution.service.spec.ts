import { TestBed } from '@angular/core/testing';

import { B2bDevolutionService } from './b2b.devolution.service';

describe('B2bReturnService', () => {
  let service: B2bDevolutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(B2bDevolutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
