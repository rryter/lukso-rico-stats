import { Injectable } from '@angular/core';
import { isContractDeployed } from '@shared/utils/contracts';
import { ERC725Account, ERC734KeyManager } from '@twy-gmbh/erc725-playground';
import { BytesLike, utils } from 'ethers';
import { forkJoin } from 'rxjs';
import { KeyManagerService } from './key-manager.service';
import { LoadingIndicatorService } from './loading-indicator.service';
import { ProxyAccountService } from './proxy-account.service';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  constructor(
    private keyManagerService: KeyManagerService,
    private proxyAccountService: ProxyAccountService,
    private loadingIndicatorService: LoadingIndicatorService
  ) {}

  getAccountContract(address: string) {
    return this.proxyAccountService.getContract(address);
  }

  getAccountDataStore(accountContract: ERC725Account) {
    return forkJoin({
      nickName: accountContract
        ?.getData(utils.formatBytes32String('nickName'))
        .then((result: BytesLike) => utils.toUtf8String(result)),
      bio: accountContract
        ?.getData(utils.formatBytes32String('bio'))
        .then((result: BytesLike) => utils.toUtf8String(result)),
    });
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
      .then((contract) => proxyAccount.transferOwnership(contract!.address))
      .then((transaction) => transaction.wait())
      .finally(() => {
        this.loadingIndicatorService.hideBlockerBackdrop();
      });
  }
}
