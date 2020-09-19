import { TestBed } from '@angular/core/testing';

import { SmartVaultService } from './smart-vault.service';

describe('SmartVaultService', () => {
  let service: SmartVaultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartVaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
