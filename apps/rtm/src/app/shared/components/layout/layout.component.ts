import { Component, DoCheck, OnInit } from '@angular/core';
import { Web3Service } from '@shared/services/web3.service';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProxyAccountService } from '@shared/services/proxy-account.service';
import { Account } from '@shared/interface/account';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreRootState } from '../../../store';
import { select, Store } from '@ngrx/store';
import { selectRouteNestedParam } from '../../../store/selectors';
@Component({
  selector: 'lukso-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, DoCheck {
  accounts: Account[] = [];
  accountAddress$: Observable<any>;
  showWrongNetworkError$: Observable<{ showWarning: boolean }>;
  constructor(
    private web3Service: Web3Service,
    private activatedRoute: ActivatedRoute,
    private store: Store<StoreRootState>
  ) {
    this.accountAddress$ = this.store.pipe(select(selectRouteNestedParam('address')));

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
    const accountsAsString = localStorage.getItem('accounts');

    if (!accountsAsString) {
      this.accounts = [] as Account[];
    } else {
      this.accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    }
  }
}
