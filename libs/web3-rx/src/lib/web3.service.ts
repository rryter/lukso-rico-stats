import { Injectable } from '@angular/core';
import { concat, Subject, Observable, ReplaySubject, of, merge } from 'rxjs';
import { catchError, mapTo, tap, withLatestFrom } from 'rxjs/operators';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  web3: any; // use proper tyings

  address$ = new ReplaySubject<string>();
  networkId$ = new ReplaySubject<number>();
  blocks$ = new Subject();

  reloadTrigger$: Observable<boolean>;

  constructor() {
    this.initializeProvider();
    this.initializeObservables();
    window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
  }

  public getBalance(address: string): Promise<number> {
    return this.web3.eth.getBalance(address);
  }

  private initializeObservables(): void {
    this.web3.eth.getBlock('latest').then((latestBlock) => {
      this.blocks$.next(latestBlock);
      this.web3.eth.subscribe('newBlockHeaders').on('data', (block) => {
        this.blocks$.next(block);
      });
    });

    this.web3.eth.getAccounts().then((accounts) => {
      if (accounts.length > 0) {
        this.address$.next(accounts[0]);
      }
      window.ethereum.on('accountsChanged', (addresses: string[]) => {
        this.address$.next(addresses[0]);
      });
    });

    this.web3.eth.getChainId().then((networkId) => {
      this.networkId$.next(networkId);
    });

    this.reloadTrigger$ = merge(this.blocks$, this.address$).pipe(mapTo(true));
  }

  private initializeProvider() {
    const ethEnabled = () => {
      if (window.ethereum) {
        window.ethereum.autoRefreshOnNetworkChange = false;
        this.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        return true;
      }
      return false;
    };

    if (!ethEnabled()) {
      alert(
        'Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!'
      );
    }
  }
}
