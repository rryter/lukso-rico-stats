import { Component, OnInit } from '@angular/core';
import { Web3Service } from '@lukso/web3-rx';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { fromWei, toBN } from 'web3-utils';
import { Wallet } from '../shared/interface/wallet';
@Component({
  selector: 'lukso-erc725',
  templateUrl: './erc725.component.html',
  styleUrls: ['./erc725.component.css'],
})
export class Erc725Component implements OnInit {
  wallet$: Observable<Wallet>;

  constructor(private web3Wrapper: Web3Service) {
    this.wallet$ = this.web3Wrapper.reloadTrigger$.pipe(
      switchMap(() => this.web3Wrapper.address$),
      switchMap((address: string) => {
        return forkJoin({
          address: of(address),
          balance: this.web3Wrapper.getBalance(address).then((balance: number) => {
            return parseFloat(fromWei(toBN(balance), 'ether'));
          }),
        });
      })
    );
  }

  ngOnInit() {}
}
