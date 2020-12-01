import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Capabilities } from '@shared/capabilities.enum';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { ProxyAccountService } from '@shared/services/proxy-account.service';
import { Web3Service } from '@shared/services/web3.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ManagementGuard implements CanActivate {
  constructor(
    private proxyAccountService: ProxyAccountService,
    private keyManagerService: KeyManagerService,
    private web3Service: Web3Service
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.hasManagementAccess(route);
  }

  private hasManagementAccess(route: ActivatedRouteSnapshot) {
    return this.web3Service.address$.pipe(
      switchMap((currentAddress: string) => {
        return this.isManager(route, currentAddress);
      })
    );
  }

  private isManager(route: ActivatedRouteSnapshot, currentAddress: string) {
    const contract = this.proxyAccountService.getContract(route.params.address);
    return contract.owner().then((owner) => {
      if (owner.toLowerCase() === currentAddress.toLocaleLowerCase()) {
        return true;
      } else {
        return this.keyManagerService
          .getContract(owner)
          .hasPrivilege(currentAddress, Capabilities.MANAGEMENT);
      }
    });
  }
}
