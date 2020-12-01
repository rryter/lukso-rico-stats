import { Injectable } from '@angular/core';
import { isContractDeployed } from '@shared/utils/contracts';
import { ERC725Account, ERC734KeyManager } from '@twy-gmbh/erc725-playground';
import { BytesLike, utils } from 'ethers';
import { forkJoin } from 'rxjs';
import { KeyManagerService } from './key-manager.service';
import { ProxyAccountService } from './proxy-account.service';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  constructor(
    private keyManagerService: KeyManagerService,
    private proxyAccountService: ProxyAccountService
  ) {}

  getAccountContract(address: string) {
    return this.proxyAccountService.getContract(address);
  }

  getAccountDataStore(accountContract: ERC725Account) {
    return forkJoin({
      firstName: accountContract
        ?.getData(utils.formatBytes32String('firstName'))
        .then((result: BytesLike) => utils.toUtf8String(result)),
      lastName: accountContract
        ?.getData(utils.formatBytes32String('lastName'))
        .then((result: BytesLike) => utils.toUtf8String(result)),
      bio: accountContract
        ?.getData(utils.formatBytes32String('bio'))
        .then((result: BytesLike) => utils.toUtf8String(result)),
    });
  }

  getKeyManagerContract(accountContract: ERC725Account) {
    return accountContract.owner().then((owner) => {
      return (isContractDeployed(
        this.keyManagerService.getContract(owner)
      ) as unknown) as ERC734KeyManager;
    });
  }
}