import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { Web3Service } from '@lukso/web3-rx';
import { Wallet } from '@shared/interface/wallet';
import { environment } from './../../../../environments/environment';
import { Observable, forkJoin, of, interval, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ethers } from 'ethers';

@Component({
  selector: 'lukso-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  accounts: any[];
  wallet$: Observable<Wallet>;
  address$: Observable<any>;
  blocks$ = new Subject();
  updater: any;
  lastBlock = Date.now();
  showWrongNetworkError$: Observable<boolean>;
  constructor(private web3Service: Web3Service, private ngZone: NgZone) {
    this.accounts = JSON.parse(window.localStorage.getItem('accounts'));
    this.address$ = this.web3Service.address$;

    this.web3Service.web3.on('block', (blockNr) => {
      this.ngZone.run(() => {
        this.lastBlock = Date.now();
        this.blocks$.next(blockNr);
      });
    });

    // const provider2 = new ethers.providers.Web3Provider(window.ethereum);
    // provider2.on('block', (blockNr) => {
    //   this.ngZone.run(() => {
    //     debugger;
    //     console.log('block2 via WEB32', blockNr);
    //     this.blocks$.next(blockNr);
    //   });
    // });

    this.updater = interval(1000).pipe(
      map(() => {
        return this.lastBlock;
      })
    );
    this.showWrongNetworkError$ = this.web3Service.networkId$.pipe(
      map((networkId) => {
        if (environment.production) {
          return networkId !== 22; // L14 LUKSO Testnet
        } else {
          return networkId !== 1337; // Local Ganache ID
        }
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
