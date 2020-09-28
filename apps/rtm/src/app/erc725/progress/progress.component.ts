import { Component, Input, OnInit } from '@angular/core';
import { ProxyAccountService } from '../../shared/services/proxy-account.service';
import { KeyManagerService } from '../../shared/services/key-manager.service';
import { LoadingIndicatorService } from '../../shared/services/loading-indicator.service';
import { Stages } from '../../shared/stages.enum';
import { Web3WrapperService } from '@lukso/web3-rx';

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
    private web3Service: Web3WrapperService
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
        this.proxyAccountService.contract.options.address = contract._address;
        this.setStage(Stages.ProxyAccount);
        this.accounts.push({ address: contract._address });
        window.localStorage.setItem('accounts', JSON.stringify(this.accounts));
      })
      .finally(() => {
        this.loadingIndicatorService.doneLoading();
      });
  }

  private setStage(stage: Stages) {
    window.localStorage.setItem('stage', JSON.stringify(stage));
    this.process.currentStage = stage;
  }

  deployKeyManager() {
    this.loadingIndicatorService.showLoadingIndicator(
      `Deploying ERC734 Key Manager and initialize it...`
    );
    this.keyManagerService
      .deploy()
      .then((contract) => {
        this.setStage(Stages.KeyManager);
        this.loadingIndicatorService.showLoadingIndicator(`Transfer Ownership of Proxy Account`);
        return this.proxyAccountService.contract.methods
          .transferOwnership(contract._address)
          .send({ from: this.web3Service.web3.currentProvider.selectedAddress });
      })
      .finally(() => {
        this.loadingIndicatorService.doneLoading();
      });
  }

  deployCustomContract() {
    this.process.currentStage = Stages.CustomContract;
  }
}
