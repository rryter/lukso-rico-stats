import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Vault } from '../interface/vault';
import { Web3Service } from '@lukso/web3-rx';
import { SmartVault, SmartVaultFactory } from '@twy-gmbh/erc725-playground';
import { ethers } from 'ethers';

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
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const factory = new SmartVaultFactory(signer);
    factory.deploy().then((contract) => {
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
        return fromWei(toBN(balance), 'ether');
      });
  }

  lockFunds(value: number) {
    this.transactions.locking = true;
    return this.contract.methods
      .lockFunds()
      .send({
        from: this.web3Service.web3.currentProvider.selectedAddress,
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
        from: this.web3Service.web3.currentProvider.selectedAddress,
      })
      .finally(() => {
        this.transactions.withdrawing = false;
      });
  }

  private getBalance(): Promise<number> {
    return this.web3Service.web3.eth.getBalance(
      this.web3Service.web3.currentProvider.selectedAddress
    );
  }
}
