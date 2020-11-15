import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { Web3Service } from '@shared/services/web3.service';
import { Wallet } from '@shared/interface/wallet';
import { environment } from './../../../../environments/environment';
import { Observable, forkJoin, of, interval, Subject } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'lukso-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  accounts: any[];
  wallet$: Observable<Wallet>;
  address$: Observable<any>;
  updater: any;
  lastBlock = Date.now();
  showWrongNetworkError$: Observable<boolean>;
  constructor(private web3Service: Web3Service, private ngZone: NgZone) {
    this.accounts = JSON.parse(window.localStorage.getItem('accounts'));
    this.address$ = this.web3Service.address$;
    this.showWrongNetworkError$ = this.web3Service.networkId$.pipe(
      map((networkId) => {
        console.log('showWrongNetworkError$');
        if (environment.production) {
          return networkId !== 22; // L14 LUKSO Testnet
        }
        return false;
      })
    );
    this.wallet$ = this.web3Service.reloadTrigger$.pipe(
      tap(() => {
        console.count('reloadTrigger$ LAYOUT COMPONENT');
      }),
      switchMap(([, address]) => {
        return forkJoin({
          address: of(address),
          balance: this.web3Service.getBalance(address),
        });
      }),
      tap(() => {
        this.accounts = JSON.parse(window.localStorage.getItem('accounts'));
      })
    );
  }
  ngOnInit(): void {}
}
