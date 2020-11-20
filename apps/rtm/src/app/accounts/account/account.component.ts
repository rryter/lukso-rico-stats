import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { ProxyAccountService } from '@shared/services/proxy-account.service';
import { ERC725Account, ERC734KeyManager } from '@twy-gmbh/erc725-playground';
import { merge } from 'rxjs';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  keyManagerContract: ERC734KeyManager;
  accountContract: ERC725Account;
  accountAddress: string;
  accountDetails$: any;

  constructor(
    private route: ActivatedRoute,
    private keyManagerService: KeyManagerService,
    private proxyAccountService: ProxyAccountService
  ) {
    this.route.params.subscribe(async (params) => {
      this.accountAddress = params.address;
      this.accountContract = this.proxyAccountService.getContract(params.address);
      this.keyManagerContract = this.keyManagerService.getContract(
        await this.accountContract.owner()
      );
    });
  }

  ngOnInit(): void {}
}
