import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Web3Service } from '@lukso/web3-rx';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { ProxyAccountService } from '@shared/services/proxy-account.service';

@Component({
  selector: 'lukso-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss'],
})
export class NewAccountComponent implements OnInit {
  accounts: any[];
  constructor(
    private proxyAccountService: ProxyAccountService,
    private loadingIndicatorService: LoadingIndicatorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accounts = JSON.parse(window.localStorage.getItem('accounts')) || [];
  }

  deployProxyAccount() {
    this.loadingIndicatorService.showLoadingIndicator(
      `Creating Proxy Account`,
      'create-proxy-account'
    );
    this.proxyAccountService
      .deployProxyAccount()
      .then((contract) => {
        this.accounts.push({ address: contract.address, stage: 2 });
        window.localStorage.setItem('accounts', JSON.stringify(this.accounts));
        this.router.navigate(['accounts', contract.address]);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.loadingIndicatorService.doneLoading();
      });
  }

  loadExistingAccount(index: number) {
    this.router.navigate(['accounts', this.accounts[index]?.address]);
  }
}
