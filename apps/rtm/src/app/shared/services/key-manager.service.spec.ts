import { TestBed } from '@angular/core/testing';
import { Web3Service } from '@shared/services/web3.service';
import { web3ServiceMock } from '@shared/mocks/web3.service.mock';
import { KeyManagerService } from './key-manager.service';

describe('KeyManagerService', () => {
  let service: KeyManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Web3Service, useValue: web3ServiceMock }],
    });
    service = TestBed.inject(KeyManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
