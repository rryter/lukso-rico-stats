import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private web3Wrapper: Web3Service, private router: Router) {
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

    const accountAddress = JSON.parse(window.localStorage.getItem('accounts'));
    console.log('accountAddress', accountAddress);
    this.router.navigate(['accounts', accountAddress[0].address]);
  }
  ngOnInit(): void {}
}
