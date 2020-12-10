import { TestBed } from '@angular/core/testing';

import { ContractsResolver } from './contracts.resolver';

describe('ContractsResolver', () => {
  let resolver: ContractsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ContractsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
