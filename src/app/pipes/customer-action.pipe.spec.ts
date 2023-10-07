import { CustomerActionPipe } from './customer-action.pipe';

describe('CustomerActionPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomerActionPipe();
    expect(pipe).toBeTruthy();
  });
});
