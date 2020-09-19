import { Injectable } from '@angular/core';
import { concat, forkJoin, merge, Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Vault } from '../interface/vault';
import { Web3WrapperService } from '@lukso/web3-rx';

@Injectable({
  providedIn: 'root',
})
export class SmartVaultService {
  private newBlocks$ = new Subject<any>();

  vault$: Observable<Vault>;
  transactions: { locking: boolean; withdrawing: boolean } = {
    locking: false,
    withdrawing: false,
  };

  private smartVaultContract: any;

  constructor(private web3Service: Web3WrapperService) {
    this.web3Service.web3.eth.subscribe('newBlockHeaders').on('data', (block) => {
      this.newBlocks$.next(block);
    });

    this.smartVaultContract = new this.web3Service.web3.eth.Contract(
      require('../smart_vault_abi.json'),
      '0xBceD82Dd0Ef3a95909E5fDE9BC9a9D6007a478d3'
    );

    const blocks$ = concat(this.web3Service.web3.eth.getBlock('latest'), this.newBlocks$);
    this.vault$ = merge(blocks$, this.web3Service.address$).pipe(
      switchMap(() => {
        return forkJoin({
          balanceAccount: this.getBalance(),
          isLocked: this.getIsLocked(),
          balanceVault: this.getVaultBalance(),
        });
      })
    );
  }

  private getIsLocked(): boolean {
    return this.smartVaultContract.methods.isLocked().call();
  }

  private getVaultBalance(): Promise<number> {
    return this.smartVaultContract.methods
      .getBalance()
      .call()
      .then((balance: number) => {
        return this.web3Service.web3.utils.fromWei(balance, 'ether');
      });
  }

  lockFunds(value: number) {
    this.transactions.locking = true;
    return this.smartVaultContract.methods
      .lockFunds()
      .send({
        from: this.web3Service.web3.currentProvider.selectedAddress,
        value: value * 10 ** 18,
      })
      .finally((result) => {
        this.transactions.locking = false;
      });
  }

  withdraw() {
    this.transactions.withdrawing = true;
    return this.smartVaultContract.methods
      .withdraw(0)
      .send({
        from: this.web3Service.web3.currentProvider.selectedAddress,
      })
      .finally((result) => {
        this.transactions.withdrawing = false;
      });
  }

  private getBalance(): Promise<number> {
    return this.web3Service.web3.eth
      .getBalance(this.web3Service.web3.currentProvider.selectedAddress)
      .then((balance) => {
        return this.web3Service.web3.utils.fromWei(balance, 'ether');
      });
  }
}
