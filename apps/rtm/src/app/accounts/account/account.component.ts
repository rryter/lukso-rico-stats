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
  keyManagerContract: ERC734KeyManager | undefined;
  accountContract: ERC725Account | undefined;
  accountAddress: string | undefined;
  accountDetails$: any;

  constructor(
    private route: ActivatedRoute,
    private keyManagerService: KeyManagerService,
    private proxyAccountService: ProxyAccountService
  ) {
    this.route.params.subscribe(async (params) => {
      this.accountAddress = params.address;
      this.accountContract = this.proxyAccountService.getContract(params.address);
      const ownerAddress = await this.accountContract.owner().catch(() => {
        return null;
      });
      if (ownerAddress) {
        this.keyManagerContract = this.keyManagerService.getContract(ownerAddress);
      }

      this.onOwnershipTransfered();
    });
  }

  ngOnInit(): void {}

  onOwnershipTransfered() {
    this.accountContract?.on('OwnershipTransferred', (signer, ownerAddress) => {
      this.keyManagerContract = this.keyManagerService.getContract(ownerAddress);
    });
  }
}
