import { Component, Input, OnInit } from '@angular/core';
import { ProxyAccountService } from '../../shared/services/proxy-account.service';
import { KeyManagerService } from '../../shared/services/key-manager.service';
import { LoadingIndicatorService } from '../../shared/services/loading-indicator.service';
import { Stages } from '../../shared/stages.enum';
import { Web3Service } from '@lukso/web3-rx';
import { Router } from '@angular/router';
import { Account } from '@shared/interface/account';

@Component({
  selector: 'lukso-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
})
export class ProgressComponent implements OnInit {
  Stages = Stages;
  accounts: any[] = JSON.parse(window.localStorage.getItem('accounts')) || [];
  process: {
    currentStage: Stages;
  };
  @Input() wallet: any;

  constructor(
    private proxyAccountService: ProxyAccountService,
    private keyManagerService: KeyManagerService,
    private loadingIndicatorService: LoadingIndicatorService,
    private router: Router,
    private web3Service: Web3Service
  ) {
    this.process = {
      currentStage: this.accounts[0]?.stage || 1,
    };
  }

  ngOnInit(): void {
    const accountsInLocalStorage = JSON.parse(window.localStorage.getItem('accounts'));
    if (accountsInLocalStorage?.length > 0) {
      this.process.currentStage = accountsInLocalStorage[0].stage;
    }
  }

  deployProxyAccount(address: string) {
    this.loadingIndicatorService.showLoadingIndicator(
      `Creating Proxy Account`,
      'create-proxy-account'
    );
    this.proxyAccountService
      .deployProxyAccount()
      .then((contract) => {
        this.proxyAccountService.contract.options.address = contract.options.address;
        this.accounts.push({ address: contract.options.address, stage: 2 });
        window.localStorage.setItem('accounts', JSON.stringify(this.accounts));
        this.router.navigate(['accounts', contract.options.address]);
      })
      .finally(() => {
        this.loadingIndicatorService.doneLoading();
      });
  }

  deployKeyManager() {
    this.loadingIndicatorService.showLoadingIndicator(
      `Deploying ERC734 Key Manager and initialize it...`
    );
    this.keyManagerService
      .deploy(this.accounts[0].address, this.web3Service.web3.currentProvider.selectedAddress)
      .then((deployedContract) => {
        this.setStage(this.accounts, Stages.KeyManager);
        return this.proxyAccountService.contract.methods
          .transferOwnership(deployedContract.options.address)
          .send({ from: this.web3Service.web3.currentProvider.selectedAddress });
      })
      .finally(() => {
        this.loadingIndicatorService.doneLoading();
      });
  }

  private setStage(accounts, stage: Stages) {
    accounts[0].stage = stage;
    window.localStorage.setItem('accounts', JSON.stringify(accounts));
    this.process.currentStage = stage;
  }

  deployCustomContract() {
    this.process.currentStage = Stages.CustomContract;
  }
}
