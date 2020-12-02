import { TestBed } from '@angular/core/testing';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { ProxyAccountService } from '@shared/services/proxy-account.service';
import { Web3Service } from '@shared/services/web3.service';

import { ManagementGuard } from './management.guard';

describe('ManagementGuard', () => {
  let guard: ManagementGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ProxyAccountService, useValue: jest.fn() },
        { provide: KeyManagerService, useValue: jest.fn() },
        { provide: Web3Service, useValue: jest.fn() },
      ],
    });
    guard = TestBed.inject(ManagementGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
