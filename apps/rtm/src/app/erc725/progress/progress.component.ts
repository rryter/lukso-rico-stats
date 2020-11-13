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

  async deployKeyManager() {
    this.loadingIndicatorService.showLoadingIndicator(
      `Deploying ERC734 Key Manager and initialize it...`
    );
    const contract = await this.keyManagerService.deploy(
      this.accounts[0].address,
      this.web3Service.selectedAddress
    );

    await contract.deployed();

    this.setStage(this.accounts, Stages.KeyManager);
    this.loadingIndicatorService.showLoadingIndicator(`Transfer Ownership of Proxy Account`);
    const ownershipTX = await this.proxyAccountService.contract.transferOwnership(contract.address);
    await ownershipTX.wait();

    this.loadingIndicatorService.doneLoading();
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
