import { TestBed } from '@angular/core/testing';
import { Web3Service } from '@lukso/web3-rx';
import { web3ServiceMock } from '@lukso/web3-rx/mocks';

import { SmartVaultService } from './smart-vault.service';

describe.only('SmartVaultService', () => {
  let service: SmartVaultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Web3Service, useValue: web3ServiceMock }],
    });
    service = TestBed.inject(SmartVaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
