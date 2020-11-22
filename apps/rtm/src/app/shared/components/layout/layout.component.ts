import { Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Web3Service } from '@shared/services/web3.service';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProxyAccountService } from '@shared/services/proxy-account.service';

@Component({
  selector: 'lukso-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, DoCheck {
  showWrongNetworkError$: Observable<{ showWarning: boolean }>;
  accountAddress: string | undefined;
  constructor(private web3Service: Web3Service, private proxyAccountService: ProxyAccountService) {
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
  }
}
