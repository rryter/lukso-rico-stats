import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { ContractService } from '@shared/services/contract.service';
import { ERC725Account, ERC734KeyManager } from '@twy-gmbh/erc725-playground';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Profile } from '../../account-editor/profile-editor/profile-editor.component';
// @ts-ignore
import ERC725 from 'erc725.js';
import schema from './schema.json';
import { Web3Service } from '@shared/services/web3.service';

@Injectable({
  providedIn: 'root',
})
export class ContractsResolver
  implements
    Resolve<{
      accountContract: ERC725Account;
      keyManagerContract: ERC734KeyManager | undefined;
      accountData: Profile;
    }> {
  constructor(private contractService: ContractService, private web3Service: Web3Service) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{
    accountContract: ERC725Account;
    keyManagerContract: ERC734KeyManager | undefined;
    accountData: Profile;
  }> {
    const _accountContract: ERC725Account = this.contractService.getAccountContract(
      route.params.address
    );
    const _keyManagerContract = this.contractService.getKeyManagerContract(_accountContract);
    // const erc725 = new ERC725(schema, _accountContract.address, this.web3Service.provider);

    return combineLatest([
      of(_accountContract),
      _keyManagerContract,
      this.contractService.getAccountDataStore(_accountContract),
      //   erc725.getAllData() as Promise<Profile>,
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
