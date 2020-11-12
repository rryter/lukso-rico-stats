import { TestBed, waitForAsync } from '@angular/core/testing';
import { Web3Service } from '@lukso/web3-rx';
import { web3ServiceMock } from '@lukso/web3-rx/mocks';

import { ProxyAccountService } from './proxy-account.service';

describe('ProxyAccountService', () => {
  let service: ProxyAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Web3Service, useValue: web3ServiceMock }],
    });
    service = TestBed.inject(ProxyAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
