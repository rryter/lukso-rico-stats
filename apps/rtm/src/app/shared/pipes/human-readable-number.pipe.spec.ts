import { HumanReadableNumberPipe } from './human-readable-number.pipe';

describe('HumanReadableNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new HumanReadableNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
