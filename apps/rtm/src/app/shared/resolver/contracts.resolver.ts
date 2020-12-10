import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { ContractService } from '@shared/services/contract.service';
import { ERC725Account, ERC734KeyManager } from '@twy-gmbh/erc725-playground';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { Profile } from '../../account-editor/profile-editor/profile-editor.component';

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
  constructor(private contractService: ContractService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{
    accountContract: ERC725Account;
    keyManagerContract: ERC734KeyManager | undefined;
    accountData: Profile;
  }> {
    const accountContract: ERC725Account = this.contractService.getAccountContract(
      route.params.address
    );
    const keyManagerContract = this.contractService.getKeyManagerContract(accountContract);

    return combineLatest([
      of(accountContract),
      keyManagerContract,
      this.contractService.getAccountDataStore(accountContract),
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
