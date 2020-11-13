import { Injectable, NgZone } from '@angular/core';
import { Observable, ReplaySubject, combineLatest } from 'rxjs';
import { shareReplay, throttleTime } from 'rxjs/operators';
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

  reloadTrigger$: Observable<[number, string]>;

  constructor(private ngZone: NgZone) {
    this.initializeProvider();
    this.initializeObservables();
    window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
  }

  public getBalance(address: string): Promise<number> {
    return this.web3.getBalance(address).then((balance) => {
      return parseFloat(utils.formatEther(balance));
    });
  }

  private initializeObservables() {
    this.web3.on('block', (block) => {
      this.ngZone.run(() => {
        this.blocks$.next(block);
      });
    });

    this.web3.listAccounts().then((accounts) => {
      if (accounts.length > 0) {
        this.ngZone.run(() => {
          this.address$.next(accounts[0]);
        });
      }
      window.ethereum.on('accountsChanged', (addresses: string[]) => {
        this.ngZone.run(() => {
          this.signer.getAddress().then((address) => {
            this.selectedAddress = address;
          });
          this.address$.next(addresses[0]);
        });
      });
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

  private initializeProvider() {
    const ethEnabled = () => {
      if (window.ethereum) {
        window.ethereum.autoRefreshOnNetworkChange = false;
        this.signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        this.web3 = new ethers.providers.JsonRpcProvider('http://rpc.l14.lukso.network:8545');
        window.ethereum.enable();
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
