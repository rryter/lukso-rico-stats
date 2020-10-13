import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Vault } from '../interface/vault';
import { Web3Service } from '@lukso/web3-rx';
import { fromWei, toBN } from 'web3-utils';
import { Contract } from 'web3-eth-contract';

const smartVaultContract = require('../../../../../../../ERC725/implementations/build/contracts/SmartVault.json');

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

  private contract: Contract;

  constructor(private web3Service: Web3Service) {
    this.contract = new this.web3Service.web3.eth.Contract(smartVaultContract.abi);
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
    this.contract
      .deploy({
        data: smartVaultContract.bytecode,
      })
      .send({
        from: this.web3Service.web3.currentProvider.selectedAddress,
      })
      .then((contract) => {
        this.isContractDeployed = true;
        this.contract.options.address = contract.options.address;
        window.localStorage.setItem(
          'smart-vault-address',
          JSON.stringify(contract.options.address)
        );
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
