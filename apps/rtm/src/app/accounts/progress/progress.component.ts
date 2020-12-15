import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProxyAccountService } from '../../shared/services/proxy-account.service';
import { KeyManagerService } from '../../shared/services/key-manager.service';
import { LoadingIndicatorService } from '../../shared/services/loading-indicator.service';
import { Stages } from '../../shared/stages.enum';
import { Web3Service } from '@shared/services/web3.service';
import { Account } from '@shared/interface/account';

@Component({
  selector: 'lukso-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit, OnChanges {
  Stages = Stages;
  accounts: Account[] = [];
  accountStage: number | undefined;

  @Input() wallet: any;
  @Input() accountAddress: string | undefined;

  constructor(
    private proxyAccountService: ProxyAccountService,
    private keyManagerService: KeyManagerService,
    private loadingIndicatorService: LoadingIndicatorService,
    private web3Service: Web3Service
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const accountsAsString = localStorage.getItem('accounts');

    if (!accountsAsString) {
      this.accounts = [] as Account[];
    } else {
      this.accounts = JSON.parse(accountsAsString);
    }

    this.accountStage = this.accounts.find(
      (account) => account.address === changes.accountAddress.currentValue
    )?.stage;
  }

  deployKeyManager() {
    this.keyManagerService
      .deploy(this.accounts[0].address, this.web3Service.selectedAddress)
      .then((contract) => this.proxyAccountService.contract?.transferOwnership(contract.address))
      .then((transaction) => transaction?.wait());
  }

  deployCustomContract() {
    this.accountStage = Stages.CustomContract;
  }
}
