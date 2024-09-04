import { TestBed } from '@angular/core/testing';

import { ComissionService } from './comission.service';

describe('ComissionService', () => {
  let service: ComissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
