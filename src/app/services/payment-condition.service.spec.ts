import { TestBed } from '@angular/core/testing';

import { PaymentConditionService } from './payment-condition.service';

describe('PaymentConditionService', () => {
  let service: PaymentConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentConditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
