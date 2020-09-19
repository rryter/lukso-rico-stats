import { TestBed } from '@angular/core/testing';

import { Web3WrapperService } from './web3-wrapper.service';

describe('Web3WrapperService', () => {
  let service: Web3WrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Web3WrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
