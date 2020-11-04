import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetPriceService } from '../services/asset-price.service';
import { CmcResponse } from '@shared/interface/cmc-price';
@Pipe({
  name: 'cmcPrice',
  pure: false,
})
export class CmcPricePipe implements PipeTransform {
  constructor(private assetPriceService: AssetPriceService) {}
  transform(value: number, ...args: unknown[]): Observable<number> {
    return this.assetPriceService.getPrice('LYXE').pipe(
      map((result: CmcResponse) => {
        if (result.data) {
          const symbol = Object.keys(result.data)[0];
          return parseFloat((result.data[symbol].quote['USD'].price * value)?.toFixed(2));
        } else {
          return 0;
        }
      })
    );
  }
}
