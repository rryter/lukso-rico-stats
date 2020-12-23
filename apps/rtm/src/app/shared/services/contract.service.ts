import { Injectable } from '@angular/core';
import { Contracts } from '@shared/interface/contracts';
import { isContractDeployed } from '@shared/utils/contracts';
import { ERC725Account, ERC734KeyManager } from '@twy-gmbh/erc725-playground';
import { utils } from 'ethers';
import { combineLatest, Observable, of } from 'rxjs';
import { KeyManagerService } from './key-manager.service';
import { LoadingIndicatorService } from './loading-indicator.service';
import { ProxyAccountService } from './proxy-account.service';
import { Web3Service } from './web3.service';
import { Profile } from '../../account-editor/profile-editor/profile-editor.component';
import { map } from 'rxjs/operators';

// @ts-ignore
import ERC725 from 'erc725.js';
import ipfsClient from 'ipfs-http-client';
import schema from '../resolver/schema.json';
import { PendingTransactionType } from '@shared/interface/transactions';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  ipfs: any;
  uploading = false;

  constructor(
    private keyManagerService: KeyManagerService,
    private proxyAccountService: ProxyAccountService,
    private loadingIndicatorService: LoadingIndicatorService,
    private web3Service: Web3Service
  ) {
    this.ipfs = ipfsClient({ protocol: 'https', host: 'ipfs.infura.io', port: 5001 });
  }

  getAccountContract(address: string) {
    return this.proxyAccountService.getContract(address);
  }

  getAccountDataStore(accountAddress: string): Promise<Profile> {
    const erc725 = new ERC725(schema, accountAddress, this.web3Service.provider);
    return erc725.fetchData('LSP3Profile');
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

  updateProfile = ([JSONURLData, { accountContract, keyManagerContract }]: [
    {
      json: string;
      hashFunctionStr: string;
      hash: string;
    },
    Contracts
  ]) => {
    this.uploading = true;
    const action = this.ipfs
      .add(JSONURLData.json)
      .then((result: any) => {
        this.uploading = false;
        const url = utils.hexlify(utils.toUtf8Bytes('ipfs://' + result.path));
        return JSONURLData.hashFunctionStr + JSONURLData.hash.substring(2) + url.substring(2);
      })
      .then((value: any) => {
        return !keyManagerContract
          ? accountContract.setData(
              '0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5',
              value
            )
          : keyManagerContract.execute(
              accountContract.interface.encodeFunctionData('setData', [
                '0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5',
                value,
              ])
            );
      });

    this.loadingIndicatorService.addTransactionPromise({
      promise: action,
      type: PendingTransactionType.All,
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
      erc725.fetchData('LSP3Profile') as Promise<Profile>,
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
