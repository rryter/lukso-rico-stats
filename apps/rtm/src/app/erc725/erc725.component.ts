import { Component, OnInit } from '@angular/core';
import { Web3WrapperService } from '@lukso/web3-rx';
import { concat, merge, Observable } from 'rxjs';
import { filter, share, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'lukso-erc725',
  templateUrl: './erc725.component.html',
  styleUrls: ['./erc725.component.css'],
})
export class Erc725Component implements OnInit {
  address$: Observable<string>;
  balance$: Observable<number>;

  constructor(private web3: Web3WrapperService) {
    this.address$ = this.web3.address$;
    this.balance$ = merge(
      concat(this.web3.web3.eth.getBlock('latest'), this.web3.blocks$),
      this.web3.address$,
      this.web3.networkId$
    ).pipe(
      withLatestFrom(this.address$),
      switchMap(([blocks, address]) => {
        return this.web3.getBalance(address);
      }),
      shareReplay()
    );
  }

  ngOnInit() {}
}
