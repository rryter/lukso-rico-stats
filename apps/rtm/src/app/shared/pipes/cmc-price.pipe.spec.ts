import { AssetPriceService } from '@shared/services/asset-price.service';
import { of } from 'rxjs';
import { CmcPricePipe } from './cmc-price.pipe';
import { CmcResponse } from '@shared/interface/cmc-price';
import * as cmcApiResponse from '@shared/mocks/api/cmc.json';

describe('CmcPricePipe', () => {
  const assetPriceServiceMock = ({
    getPrice: jest.fn().mockReturnValue(of(cmcApiResponse as CmcResponse)),
  } as unknown) as AssetPriceService;

  it('create an instance', () => {
    const pipe = new CmcPricePipe(assetPriceServiceMock);
    expect(pipe).toBeTruthy();
  });

  it('should fetch price', (done) => {
    const pipe = new CmcPricePipe(assetPriceServiceMock);
    pipe.transform(2.5).subscribe((price) => {
      expect(price).toEqual(1.85);
      done();
    });
  });
});
