import { TestBed } from '@angular/core/testing';

import { AssetPriceService } from './asset-price.service';

describe('AssetPriceService', () => {
  let service: AssetPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
