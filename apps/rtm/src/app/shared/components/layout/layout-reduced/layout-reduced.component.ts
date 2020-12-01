import { Component, OnInit, ChangeDetectionStrategy, DoCheck } from '@angular/core';
import { ProxyAccountService } from '@shared/services/proxy-account.service';

@Component({
  selector: 'lukso-layout-reduced',
  templateUrl: './layout-reduced.component.html',
  styleUrls: ['./layout-reduced.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutReducedComponent implements DoCheck {
  accounts: Account[] = [];
  accountAddress: string | undefined = undefined;
  constructor(private proxyAccountService: ProxyAccountService) {}

  ngDoCheck() {
    this.accountAddress = this.proxyAccountService.contract?.address;
    const accountsAsString = localStorage.getItem('accounts');

    if (!accountsAsString) {
      this.accounts = [] as Account[];
    } else {
      this.accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    }
  }
}
