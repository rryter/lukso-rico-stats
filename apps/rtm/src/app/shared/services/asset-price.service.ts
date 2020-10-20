import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AssetPriceService {
  priceMapping = {};
  constructor(private http: HttpClient) {
    this.priceMapping = {};
  }

  getPrice(symbol: string) {
    if (!this.priceMapping[symbol]) {
      this.priceMapping[symbol] = this.http
        .get(`https://api.wallet.rryter.ch`)
        .pipe(shareReplay(1));
    }
    return this.priceMapping[symbol];
  }
}
