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
        .get(`/api/v1/cryptocurrency/quotes/latest?symbol=${symbol}`, {
          headers: {
            'X-CMC_PRO_API_KEY': '343b0b11-c2cb-483b-865a-eef4fd489aba',
          },
        })
        .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    return this.priceMapping[symbol];
  }
}
