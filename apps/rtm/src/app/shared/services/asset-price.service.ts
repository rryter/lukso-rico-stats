import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CmcResponse } from '@shared/interface/cmc-price';

@Injectable({
  providedIn: 'root',
})
export class AssetPriceService {
  priceMapping: { [key: string]: Observable<CmcResponse> } = {};
  constructor(private http: HttpClient) {
    this.priceMapping = {};
  }

  getPrice(symbol: string) {
    if (!this.priceMapping[symbol]) {
      this.priceMapping[symbol] = this.http
        .get<CmcResponse>(`https://api.wallet.rryter.ch`)
        .pipe(shareReplay(1));
    }
    return this.priceMapping[symbol];
  }
}
