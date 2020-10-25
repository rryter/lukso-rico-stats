import { Injectable } from '@angular/core';
import { Erc734KeyManager, Erc734KeyManagerFactory } from '@twy-gmbh/erc725-playground';
import { LoadingIndicatorService } from './loading-indicator.service';

@Injectable({
  providedIn: 'root',
})
export class KeyManagerService {
  contract: Erc734KeyManager;
  isContractDeployed = false;

  constructor(private loadingIndicatorService: LoadingIndicatorService) {}

  deploy(accountAddress: string, managementAddress: string): Promise<Erc734KeyManager> {
    return new Erc734KeyManagerFactory()
      .deploy(accountAddress, managementAddress)
      .then((contract) => {
        this.contract = contract;
        this.loadingIndicatorService.showLoadingIndicator(`Transfer Ownership of Proxy Account`);
        return contract;
      });
  }
}
