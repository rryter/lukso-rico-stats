import { Injectable } from '@angular/core';
import { ERC734KeyManager, ERC734KeyManagerFactory } from '@twy-gmbh/erc725-playground';
import { ethers } from 'ethers';
import { LoadingIndicatorService } from './loading-indicator.service';

@Injectable({
  providedIn: 'root',
})
export class KeyManagerService {
  contract: ERC734KeyManager;
  isContractDeployed = false;

  constructor(private loadingIndicatorService: LoadingIndicatorService) {}

  getContract(address: string) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    this.contract = new ERC734KeyManagerFactory(signer).attach(address);
    return this.contract;
  }

  deploy(accountAddress: string, managementAddress: string): Promise<ERC734KeyManager> {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ERC734KeyManagerFactory(signer)
      .deploy(accountAddress, managementAddress)
      .then((contract) => {
        this.contract = contract;
        this.loadingIndicatorService.showLoadingIndicator(`Transfer Ownership of Proxy Account`);
        return contract;
      });
  }
}
