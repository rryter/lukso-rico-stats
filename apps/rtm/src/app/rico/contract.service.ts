const Web3 = require('web3');
import { Injectable } from '@angular/core';
import { concat, forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { Vault } from '../shared/interface/vault';

const SmartVoteAbi = require('./../shared/smart_vault_abi.json');
let myContract;

declare global {
  interface Window {
    [index: string]: any;
  }
}
@Injectable({
  providedIn: 'root',
})
export class ContractService {
  vault$: Observable<Vault>;
  transactions: { locking: boolean; withdrawing: boolean } = {
    locking: false,
    withdrawing: false,
  };
  web3: any;
  constructor() {
    const subject = webSocket('ws://127.0.0.1:7545');
    this.web3 = new Web3(window.web3.currentProvider);

    myContract = new this.web3.eth.Contract(
      SmartVoteAbi,
      '0x0Ff38Eff484Fb304e023755624a790bf075F6f87'
    );

    this.vault$ = concat(this.web3.eth.getBlock('latest'), this.getNewBlocks(subject)).pipe(
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
    return myContract.methods.isLocked().call();
  }

  private getVaultBalance(): Promise<number> {
    return myContract.methods
      .getBalance()
      .call()
      .then((balance: number) => {
        return this.web3.utils.fromWei(balance, 'ether');
      });
  }

  private getNewBlocks(subject): Observable<any> {
    return subject.multiplex(
      () => ({
        id: 2,
        jsonrpc: '2.0',
        method: 'eth_subscribe',
        params: ['newHeads'],
      }),
      () => ({
        id: 2,
        jsonrpc: '2.0',
        method: 'eth_subscribe',
        params: ['newHeads'],
      }),
      (message: any) => message.method === 'eth_subscription'
    );
  }

  lockFunds() {
    this.transactions.locking = true;
    return myContract.methods
      .lockFunds()
      .send({
        from: this.web3.currentProvider.selectedAddress,
        value: 2 * 10 ** 18,
      })
      .finally((result) => {
        this.transactions.locking = false;
      });
  }

  withdraw() {
    this.transactions.withdrawing = true;
    return myContract.methods
      .withdraw(0)
      .send({
        from: this.web3.currentProvider.selectedAddress,
      })
      .finally((result) => {
        this.transactions.withdrawing = false;
      });
  }

  private getBalance(): Promise<number> {
    return this.web3.eth.getBalance(this.web3.currentProvider.selectedAddress).then((balance) => {
      return this.web3.utils.fromWei(balance, 'ether');
    });
  }
}
