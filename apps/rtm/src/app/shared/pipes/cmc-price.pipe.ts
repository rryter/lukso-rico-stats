import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs/operators';
import { AssetPriceService } from '../services/asset-price.service';

@Pipe({
  name: 'cmcPrice',
  pure: false,
})
export class CmcPricePipe implements PipeTransform {
  constructor(private assetPriceService: AssetPriceService) {}
  transform(value: number, ...args: unknown[]): unknown {
    return this.assetPriceService.getPrice('LYXE').pipe(
      map((result: any) => {
        const symbol = Object.keys(result.data)[0];
        return result.data[symbol].quote['USD'].price * value;
      })
    );
  }
}
