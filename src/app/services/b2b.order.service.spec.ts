import { TestBed } from '@angular/core/testing';

import { B2bOrderService } from './b2b.order.service';

describe('OrderService', () => {
  let service: B2bOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(B2bOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
