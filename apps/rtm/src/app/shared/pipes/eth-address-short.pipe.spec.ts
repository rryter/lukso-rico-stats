import { EthAddressShortPipe } from './eth-address-short.pipe';

describe('EthAddressShortPipe', () => {
  it('create an instance', () => {
    const pipe = new EthAddressShortPipe();
    expect(pipe).toBeTruthy();
  });
});
