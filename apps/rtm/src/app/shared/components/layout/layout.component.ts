import { Component, OnInit } from '@angular/core';
import { Web3Service } from '@lukso/web3-rx';
import { Wallet } from '@shared/interface/wallet';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'lukso-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  wallet$: Observable<Wallet>;
  address$: Observable<any>;
  constructor(private web3Wrapper: Web3Service) {
    this.address$ = this.web3Wrapper.address$;
    this.wallet$ = this.web3Wrapper.reloadTrigger$.pipe(
      switchMap(() => this.web3Wrapper.address$),
      switchMap((address: string) => {
        return forkJoin({
          address: of(address),
          balance: this.web3Wrapper.getBalance(address),
        });
      })
    );
  }
  ngOnInit(): void {}
}
