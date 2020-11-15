import { Injectable, NgZone } from '@angular/core';
import { Observable, ReplaySubject, combineLatest } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ethers, Signer, utils } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  web3: JsonRpcProvider;
  signer: Signer;
  selectedAddress: string;

  address$ = new ReplaySubject<string>(1);
  networkId$ = new ReplaySubject<number>(1);
  blocks$ = new ReplaySubject<number>(1);

  reloadTrigger$: Observable<any>;

  constructor(private ngZone: NgZone) {}

  initialize(url: string) {
    this.initializeProvider(url);
    this.initializeObservables();
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
    }
  }

  public getBalance(address: string): Promise<number> {
    return this.web3.getBalance(address).then((balance) => {
      return parseFloat(utils.formatEther(balance));
    });
  }

  private initializeObservables() {
    this.web3.on('block', (block) => {
      this.ngZone.run(() => {
        console.log('xxx: debug: block');
        this.blocks$.next(block);
      });
    });

    this.web3.listAccounts().then((accounts) => {
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

    this.web3.getNetwork().then((network) => {
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

  private initializeProvider(url: string = 'http://localhost:8545') {
    this.web3 = new ethers.providers.JsonRpcProvider(url);
    this.signer = this.web3.getSigner();
    this.web3.pollingInterval = 500;
    const ethEnabled = () => {
      if (window.ethereum) {
        this.web3.pollingInterval = 2000;
        window.ethereum.autoRefreshOnNetworkChange = false;
        // this.web3 = new ethers.providers.JsonRpcProvider('http://rpc.l14.lukso.network/:8545');
        this.signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

        return true;
      }
      return false;
    };

    if (!ethEnabled()) {
      window.alert(
        'Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!'
      );
    }
  }
}
