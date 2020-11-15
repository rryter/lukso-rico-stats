import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Vault } from '../interface/vault';
import { Web3Service } from '@shared/services/web3.service';
import { SmartVault, SmartVaultFactory } from '@twy-gmbh/erc725-playground';
import { ethers, utils } from 'ethers';

@Injectable({
  providedIn: 'root',
})
export class SmartVaultService {
  isContractDeployed: boolean;
  vault$: Observable<Vault>;
  transactions: { locking: boolean; withdrawing: boolean } = {
    locking: false,
    withdrawing: false,
  };

  private contract: SmartVault;

  constructor(private web3Service: Web3Service) {
    this.vault$ = this.web3Service.reloadTrigger$.pipe(
      switchMap(() => {
        return forkJoin({
          balanceAccount: this.getBalance(),
          isLocked: this.getIsLocked(),
          balanceVault: this.getVaultBalance(),
          address: of('whaaat?'), // todo
        });
      })
    );
  }

  deploy() {
    new SmartVaultFactory(this.web3Service.signer).deploy().then((contract) => {
      this.isContractDeployed = true;
      window.localStorage.setItem('smart-vault-address', JSON.stringify(contract.options.address));
      this.contract = contract;
      return contract;
    });
  }

  private getIsLocked(): boolean {
    return this.contract.methods.isLocked().call();
  }

  private getVaultBalance(): Promise<number> {
    return this.contract.methods
      .getBalance()
      .call()
      .then((balance: number) => {
        return utils.formatEther(balance);
      });
  }

  lockFunds(value: number) {
    this.transactions.locking = true;
    return this.contract.methods
      .lockFunds()
      .send({
        from: this.web3Service.selectedAddress,
        value: value * 10 ** 18,
      })
      .finally(() => {
        this.transactions.locking = false;
      });
  }

  withdraw() {
    this.transactions.withdrawing = true;
    return this.contract.methods
      .withdraw(0)
      .send({
        from: this.web3Service.selectedAddress,
      })
      .finally(() => {
        this.transactions.withdrawing = false;
      });
  }

  private getBalance(): Promise<any> {
    return this.web3Service.web3.getBalance(this.web3Service.selectedAddress);
  }
}
