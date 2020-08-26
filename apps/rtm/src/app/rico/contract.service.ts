import { HostBinding, Injectable } from '@angular/core';
import light, { MakeContract, makeContract } from '@parity/light.js';
import Api from '@parity/api';
import { eip20 } from '@parity/contracts/lib/abi/index';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  rICOBalance$: Observable<{ tokens: number; percentage: number }>;
  private luksoContract: MakeContract;

  constructor() {
    const provider = new Api.Provider.Ws(
      'wss://mainnet.infura.io/ws/v3/ec449b4c06864799a269f3859effc0f3'
    );
    light.setProvider(provider);

    this.luksoContract = makeContract(
      '0xA8b919680258d369114910511cc87595aec0be6D',
      eip20
    );

    this.rICOBalance$ = this.luksoContract
      .balanceOf$('0xe417b912f6cb6592ec2d71dbf6f2b48191b2cdf6')
      .pipe(
        startWith({
          c: [
            parseFloat(window.localStorage.getItem('availableLyxeTokens')) *
              10000,
          ],
        }),
        map((balance: any) => {
          const reversibleIcoSupply = 10_000_000;
          const availableLyxeTokens = Math.round(balance.c[0] / 10_000);
          const availablePercentage =
            (100 / reversibleIcoSupply) * availableLyxeTokens;

          window.localStorage.setItem(
            'availablePercentage',
            availablePercentage.toString()
          );
          window.localStorage.setItem(
            'availableLyxeTokens',
            availableLyxeTokens.toString()
          );

          return {
            tokens: availableLyxeTokens,
            percentage: (
              (100 / reversibleIcoSupply) *
              availableLyxeTokens
            ).toFixed(2),
          };
        })
      );
  }
}
