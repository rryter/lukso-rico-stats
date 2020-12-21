import { Injectable } from '@angular/core';
import { Contracts } from '@shared/interface/contracts';
import { PendingTransactionType } from '@shared/interface/transactions';
import { isContractDeployed } from '@shared/utils/contracts';
import { ERC725Account, ERC734KeyManager } from '@twy-gmbh/erc725-playground';
import { BytesLike, utils } from 'ethers';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { KeyManagerService } from './key-manager.service';
import { LoadingIndicatorService } from './loading-indicator.service';
import { ProxyAccountService } from './proxy-account.service';
import { Web3Service } from './web3.service';
import ERC725 from 'erc725.js';
import schema from '../resolver/schema.json';
import { Profile } from '../../account-editor/profile-editor/profile-editor.component';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ContractService {
  constructor(
    private keyManagerService: KeyManagerService,
    private proxyAccountService: ProxyAccountService,
    private loadingIndicatorService: LoadingIndicatorService,
    private web3Service: Web3Service
  ) {}

  getAccountContract(address: string) {
    return this.proxyAccountService.getContract(address);
  }

  getAccountDataStore(accountAddress: string): Promise<Profile> {
    const erc725 = new ERC725(schema, accountAddress, this.web3Service.provider);
    return erc725.getAllData();
  }

  getKeyManagerContract(accountContract: ERC725Account) {
    return accountContract
      .owner()
      .then((owner) => {
        let contract;
        try {
          contract = this.keyManagerService.getContract(owner);
        } catch (error) {
          return undefined;
        }
        if (contract) {
          return (isContractDeployed(contract) as unknown) as ERC734KeyManager;
        } else {
          return undefined;
        }
      })
      .catch(() => {
        return undefined;
      });
  }

  getIsExecutor(address: string): Promise<boolean> {
    return this.keyManagerService.getIsExecutor(address);
  }

  getIsManager(address: string): Promise<boolean> {
    return this.keyManagerService.getIsManager(address);
  }

  deployKeyManager(proxyAccount: ERC725Account, ownerAddress: string) {
    return this.keyManagerService
      .deploy(proxyAccount.address, ownerAddress)
      .then((contract) => proxyAccount.transferOwnership(contract.address))
      .then((transaction) => transaction.wait())
      .finally(() => {
        this.loadingIndicatorService.hideBlockerBackdrop();
      });
  }

  updateProfile = ([keyValuePairs, { accountContract, keyManagerContract }]: [any, Contracts]) => {
    const action = !keyManagerContract
      ? accountContract.setDataWithArray(keyValuePairs)
      : keyManagerContract.execute(
          accountContract.interface.encodeFunctionData('setDataWithArray', [keyValuePairs])
        );

    this.loadingIndicatorService.addPromise({
      promise: action,
      type: PendingTransactionType.Profile,
      action: 'Saving Profile',
    });
  };

  getContractsAndData(address: string): Observable<Contracts> {
    const _accountContract: ERC725Account = this.getAccountContract(address);
    const _keyManagerContract = this.getKeyManagerContract(_accountContract);
    const erc725 = new ERC725(schema, _accountContract.address, this.web3Service.provider);

    return combineLatest([
      of(_accountContract),
      _keyManagerContract,
      erc725.getAllData() as Promise<Profile>,
    ]).pipe(
      map(([accountContract, keyManagerContract, accountData]) => {
        return {
          accountData,
          accountContract,
          keyManagerContract,
        };
      })
    );
  }
}
