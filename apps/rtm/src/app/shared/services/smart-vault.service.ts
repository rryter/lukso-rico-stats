import { Injectable } from '@angular/core';
import { concat, forkJoin, merge, Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Vault } from '../interface/vault';
import { Web3WrapperService } from '@lukso/web3-rx';
import { environment } from '../../../environments/environment';
const smartVaultContract = require('../../../../../../../ERC725/implementations/build/contracts/SmartVault.json');
@Injectable({
  providedIn: 'root',
})
export class SmartVaultService {
  private newBlocks$ = new Subject<any>();

  isContractDeployed: boolean;
  vault$: Observable<Vault>;
  transactions: { locking: boolean; withdrawing: boolean } = {
    locking: false,
    withdrawing: false,
  };

  private contract: any;

  constructor(private web3Service: Web3WrapperService) {
    this.web3Service.web3.eth.subscribe('newBlockHeaders').on('data', (block) => {
      this.newBlocks$.next(block);
    });

    this.contract = new this.web3Service.web3.eth.Contract(require('../smart_vault_abi.json'));

    const blocks$ = concat(this.web3Service.web3.eth.getBlock('latest'), this.newBlocks$);
    this.vault$ = merge(blocks$, this.web3Service.address$, this.web3Service.networkId$).pipe(
      switchMap(() => {
        return forkJoin({
          balanceAccount: this.getBalance(),
          isLocked: this.getIsLocked(),
          balanceVault: this.getVaultBalance(),
          address: of(environment.contracts.vault),
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
        console.log(contract);
        this.isContractDeployed = true;
        this.contract.options.address = contract._address;
        window.localStorage.setItem('smart-vault-address', JSON.stringify(contract._address));
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
        return this.web3Service.web3.utils.fromWei(balance, 'ether');
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
      .finally((result) => {
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
