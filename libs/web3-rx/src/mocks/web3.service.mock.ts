import { of } from 'rxjs';

const web3ServiceMock = {
  web3: {
    currentProvider: {
      selectedAddress: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
    },
    eth: {
      getBlock: jest.fn(),
    },
    on: jest.fn().mockImplementation(() => {
      return of({});
    }),
  },
  getBalance: jest.fn().mockImplementation(() => {
    return Promise.resolve(0);
  }),
  networkId$: of({}),
  reloadTrigger$: of({}),
} as any;

export { web3ServiceMock };
