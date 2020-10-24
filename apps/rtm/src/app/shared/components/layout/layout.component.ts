import { Component, OnInit } from '@angular/core';
import { Web3Service } from '@lukso/web3-rx';
import { Wallet } from '@shared/interface/wallet';
import { environment } from './../../../../environments/environment';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'lukso-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  accounts: any[];
  wallet$: Observable<Wallet>;
  address$: Observable<any>;
  showWrongNetworkError$: Observable<boolean>;
  constructor(private web3Wrapper: Web3Service) {
    this.accounts = JSON.parse(window.localStorage.getItem('accounts'));
    this.address$ = this.web3Wrapper.address$;
    this.showWrongNetworkError$ = this.web3Wrapper.networkId$.pipe(
      map((networkId) => {
        if (environment.production) {
          return networkId !== 22; // L14 LUKSO Testnet
        } else {
          return networkId !== 1337; // Local Ganache ID
        }
      })
    );
    this.wallet$ = this.web3Wrapper.reloadTrigger$.pipe(
      switchMap(() => this.web3Wrapper.address$),
      switchMap((address: string) => {
        return forkJoin({
          address: of(address),
          balance: this.web3Wrapper.getBalance(address),
        });
      }),
      tap(() => {
        this.accounts = JSON.parse(window.localStorage.getItem('accounts'));
      })
    );
  }
  ngOnInit(): void {}
}
