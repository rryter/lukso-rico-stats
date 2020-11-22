import { Injectable, NgZone } from '@angular/core';
import { Observable, ReplaySubject, combineLatest } from 'rxjs';
import { Signer, utils } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

import { getProviderAndSigner } from './web3/web3.provider';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  provider!: JsonRpcProvider;
  signer!: Signer;
  selectedAddress!: string;

  address$ = new ReplaySubject<string>(1);
  networkId$ = new ReplaySubject<number>(1);
  blocks$ = new ReplaySubject<number>(1);

  reloadTrigger$!: Observable<any>;

  constructor(private ngZone: NgZone) {}

  initialize() {
    const providerAndSigner = getProviderAndSigner();

    if (providerAndSigner) {
      const { provider, signer } = providerAndSigner;
      this.provider = provider;
      this.signer = signer;
    } else {
      window.alert('OMG');
    }

    this.initializeObservables();
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (_chainId: any) => window.location.reload());
    }
  }

  public getBalance(address: string): Promise<number> {
    return this.provider.getBalance(address).then((balance) => {
      return parseFloat(utils.formatEther(balance));
    });
  }

  private initializeObservables() {
    this.provider.on('block', (block) => {
      this.ngZone.run(() => {
        this.blocks$.next(block);
      });
    });

    this.provider.listAccounts().then((accounts) => {
      if (accounts.length > 0) {
        this.ngZone.run(() => {
          this.address$.next(accounts[0]);
        });
      }

      if (window.ethereum) {
        window.ethereum.on('accountsChanged', (addresses: string[]) => {
          this.ngZone.run(() => {
            this.selectedAddress = addresses[0];
            this.address$.next(addresses[0]);
          });
        });
      }
    });

    this.provider.getNetwork().then((network) => {
      this.networkId$.next(network.chainId);
    });

    this.signer.getAddress().then((address) => {
      this.selectedAddress = address;
    });

    this.reloadTrigger$ = combineLatest([
      this.blocks$.asObservable(),
      this.address$.asObservable(),
    ]);
  }
}
