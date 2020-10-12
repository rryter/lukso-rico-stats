import { Component, Input, OnInit } from '@angular/core';
import { ProxyAccountService } from '../../shared/services/proxy-account.service';
import { KeyManagerService } from '../../shared/services/key-manager.service';
import { LoadingIndicatorService } from '../../shared/services/loading-indicator.service';
import { Stages } from '../../shared/stages.enum';
import { Web3Service } from '@lukso/web3-rx';

@Component({
  selector: 'lukso-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
})
export class ProgressComponent implements OnInit {
  process: {
    currentStage: Stages;
  } = {
    currentStage: Stages.Minimal,
  };
  Stages = Stages;
  accounts: any[] = JSON.parse(window.localStorage.getItem('accounts')) || [];
  @Input() wallet: any;

  constructor(
    private proxyAccountService: ProxyAccountService,
    private keyManagerService: KeyManagerService,
    private loadingIndicatorService: LoadingIndicatorService,
    private web3Service: Web3Service
  ) {}

  ngOnInit(): void {
    if (parseInt(window.localStorage.getItem('stage'), 0) >= 0) {
      this.process.currentStage = parseInt(window.localStorage.getItem('stage'), 0);
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
        this.setStage(Stages.ProxyAccount);
        this.accounts.push({ address: contract.options.address });
        window.localStorage.setItem('accounts', JSON.stringify(this.accounts));
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
      .deploy(this.web3Service.web3.currentProvider.selectedAddress)
      .then((deployedContract) => {
        this.setStage(Stages.KeyManager);
        this.proxyAccountService.contract.options.address = this.accounts[0].address;
        return this.proxyAccountService.contract.methods
          .transferOwnership(deployedContract.options.address)
          .send({ from: this.web3Service.web3.currentProvider.selectedAddress })
          .then(() => {
            this.loadingIndicatorService.doneLoading();
          });
      });
  }

  private setStage(stage: Stages) {
    window.localStorage.setItem('stage', JSON.stringify(stage));
    this.process.currentStage = stage;
  }

  deployCustomContract() {
    this.process.currentStage = Stages.CustomContract;
  }
}
