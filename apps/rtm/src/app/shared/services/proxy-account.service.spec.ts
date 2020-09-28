import { TestBed } from '@angular/core/testing';

import { ProxyAccountService } from './proxy-account.service';

describe('ProxyAccountService', () => {
  let service: ProxyAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProxyAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
