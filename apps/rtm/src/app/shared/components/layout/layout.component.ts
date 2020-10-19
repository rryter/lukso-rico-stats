import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Web3Service } from '@lukso/web3-rx';
import { Wallet } from '@shared/interface/wallet';
import { environment } from './../../../../environments/environment';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'lukso-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  wallet$: Observable<Wallet>;
  address$: Observable<any>;
  showWrongNetworkError$: Observable<boolean>;
  constructor(private web3Wrapper: Web3Service, private router: Router) {
    this.address$ = this.web3Wrapper.address$;
    this.showWrongNetworkError$ = this.web3Wrapper.networkId$.pipe(
      map((networkId) => {
        if (environment.production) {
          return networkId !== 22;
        } else {
          return networkId !== 1337;
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
      })
    );

    const accountAddress = JSON.parse(window.localStorage.getItem('accounts'));
    if (accountAddress) {
      this.router.navigate(['accounts', accountAddress[0].address]);
    }
  }
  ngOnInit(): void {}
}
