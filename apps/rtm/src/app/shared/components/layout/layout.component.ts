import { Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Web3Service } from '@shared/services/web3.service';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProxyAccountService } from '@shared/services/proxy-account.service';
import { Router } from '@angular/router';
import { Account } from '@shared/interface/account';
@Component({
  selector: 'lukso-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, DoCheck {
  accounts: Account[] = [];
  showWrongNetworkError$: Observable<{ showWarning: boolean }>;
  accountAddress: string | undefined;
  constructor(
    private web3Service: Web3Service,
    private proxyAccountService: ProxyAccountService,
    private router: Router
  ) {
    this.showWrongNetworkError$ = this.web3Service.networkId$.pipe(
      map((networkId) => {
        if (environment.production) {
          return { showWarning: networkId !== 22 }; // L14 LUKSO Testnet}
        }
        return { showWarning: false };
      })
    );
  }
  ngOnInit(): void {}
  ngDoCheck() {
    this.accountAddress = this.proxyAccountService.contract?.address;
    const accountsAsString = localStorage.getItem('accounts');

    if (!accountsAsString) {
      this.accounts = [] as Account[];
    } else {
      this.accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    }
  }

  loadExistingAccount(index: number) {
    this.router.navigate(['accounts', this.accounts[index]?.address]);
  }
}
