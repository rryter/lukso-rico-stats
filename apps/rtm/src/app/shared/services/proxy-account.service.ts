import { Injectable } from '@angular/core';
import { PendingTransaction } from '@shared/interface/transactions';
import { Web3Service } from '@shared/services/web3.service';
import { ERC725Account, ERC725AccountFactory } from '@twy-gmbh/erc725-playground';
import { Account } from '@shared/interface/account';
import { combineLatest, of, NEVER, forkJoin, Observable } from 'rxjs';
import { switchMap, shareReplay, catchError } from 'rxjs/operators';
import { KeyManagerService } from './key-manager.service';
import { LoadingIndicatorService } from './loading-indicator.service';
import { ContractTransaction, Transaction } from 'ethers';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProxyAccountService {
  contract: ERC725Account | undefined;

  constructor(
    private web3Service: Web3Service,
    private router: Router,
    private loadingIndicatorService: LoadingIndicatorService,
    private keyManagerService: KeyManagerService
  ) {}

  getContract(address: string) {
    this.contract = new ERC725AccountFactory(this.web3Service.signer).attach(address);
    return this.contract;
  }

  getAccount(address$: Observable<string>) {
    return combineLatest([
      address$,
      this.web3Service.reloadTrigger$,
      this.loadingIndicatorService.pendingTransactions$,
    ]).pipe(
      switchMap(([address]: [string, boolean, PendingTransaction[]]) => {
        const contract = this.getContract(address);
        return combineLatest([contract.owner(), of(address)]).pipe(
          shareReplay(1),
          catchError((error) => {
            console.warn('error', error);
            return NEVER;
          })
        );
      }),
      switchMap(([owner, address]) => {
        this.keyManagerService.getContract(owner);
        return this.getAccountDetails(address);
      }),
      catchError((error) => {
        console.error(error);
        return of({} as Account);
      })
    );
  }

  private getAccountDetails(address: string): Observable<Account> {
    const accountsAsString = localStorage.getItem('accounts');
    let accounts: Account[];

    if (!accountsAsString) {
      accounts = [] as Account[];
    } else {
      accounts = JSON.parse(accountsAsString);
    }
    const stage = accounts.find((account) => account.address === address)?.stage;

    return forkJoin({
      address: of(address),
      balance: this.getBalance(address),
      isExecutable: this.keyManagerService.getIsExecutor(this.web3Service.selectedAddress),
      isManagable: this.keyManagerService.getIsManager(this.web3Service.selectedAddress),
      stage: of(stage),
    }) as Observable<Account>;
  }

  private getBalance(address: string): Promise<number> {
    return this.web3Service.getBalance(address);
  }

  async deployProxyAccount() {
    const signer = this.web3Service.signer;
    this.contract = await new ERC725AccountFactory(signer)
      .deploy(this.web3Service.selectedAddress)
      .catch((error) => {
        console.error(error);
        this.router.navigate(['/']);
        return undefined;
      });

    return this.contract;
  }
}
