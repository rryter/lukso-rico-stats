import { TestBed } from '@angular/core/testing';

import { ContractService } from './contract.service';
import { KeyManagerService } from './key-manager.service';
import { ProxyAccountService } from './proxy-account.service';

describe('ContractService', () => {
  let service: ContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: KeyManagerService, useValue: jest.fn() },
        { provide: ProxyAccountService, useValue: jest.fn() },
      ],
    });
    service = TestBed.inject(ContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
