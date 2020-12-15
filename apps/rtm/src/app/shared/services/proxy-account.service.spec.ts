import { TestBed, waitForAsync } from '@angular/core/testing';
import { Web3Service } from '@shared/services/web3.service';
import { web3ServiceMock } from '@shared/mocks/web3.service.mock';
import { ProxyAccountService } from './proxy-account.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('ProxyAccountService', () => {
  let service: ProxyAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Web3Service, useValue: web3ServiceMock }],
      imports: [RouterTestingModule, MatProgressSpinnerModule],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(ProxyAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
