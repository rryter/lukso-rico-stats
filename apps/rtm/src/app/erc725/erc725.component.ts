import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Web3Service } from '@lukso/web3-rx';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Wallet } from '../shared/interface/wallet';
@Component({
  selector: 'lukso-erc725',
  templateUrl: './erc725.component.html',
  styleUrls: ['./erc725.component.css'],
})
export class Erc725Component implements OnInit {
  wallet$: Observable<Wallet>;

  constructor(
    private web3Service: Web3Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.wallet$ = this.web3Service.reloadTrigger$.pipe(
      switchMap(() => this.web3Service.address$),
      switchMap((address: string) => {
        return forkJoin({
          address: of(address),
          balance: this.web3Service.getBalance(address),
        });
      })
    );
  }

  ngOnInit() {
    this.route.params.subscribe((params: { address: string }) => {
      if (params.address) {
        this.router.navigate(['accounts', params.address]);
      }
    });
  }
}
