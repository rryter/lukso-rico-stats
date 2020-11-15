import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProxyAccountService } from '../../shared/services/proxy-account.service';
import { KeyManagerService } from '../../shared/services/key-manager.service';
import { LoadingIndicatorService } from '../../shared/services/loading-indicator.service';
import { Stages } from '../../shared/stages.enum';
import { Web3Service } from '@shared/services/web3.service';

@Component({
  selector: 'lukso-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
})
export class ProgressComponent implements OnInit, OnChanges {
  Stages = Stages;
  accounts: any[] = JSON.parse(window.localStorage.getItem('accounts')) || [];
  process: {
    currentStage: Stages;
  };
  @Input() wallet: any;
  @Input() stage = 2;

  constructor(
    private proxyAccountService: ProxyAccountService,
    private keyManagerService: KeyManagerService,
    private loadingIndicatorService: LoadingIndicatorService,
    private web3Service: Web3Service
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.process = {
      currentStage: changes.stage.currentValue,
    };
  }

  deployKeyManager() {
    this.loadingIndicatorService.showLoadingIndicator(
      `Deploying ERC734 Key Manager and initialize it...`
    );

    this.keyManagerService
      .deploy(this.accounts[0].address, this.web3Service.selectedAddress)
      .then((contract) => {
        this.loadingIndicatorService.doneLoading();
        this.setStage(this.accounts, Stages.KeyManager);
        this.loadingIndicatorService.showLoadingIndicator(`Transfer Ownership of Proxy Account`);
        return this.proxyAccountService.contract.transferOwnership(contract.address);
      })
      .then((transaction) => {
        return transaction.wait();
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
