import { ShortnumberPipe } from './shortnumber.pipe';

describe('ShortnumberPipe', () => {
  it('create an instance', () => {
    const pipe = new ShortnumberPipe();
    expect(pipe).toBeTruthy();
  });
});
