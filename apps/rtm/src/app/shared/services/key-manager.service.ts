import { Injectable } from '@angular/core';
import { Web3Service } from '@lukso/web3-rx';
import { ERC734KeyManager, ERC734KeyManagerFactory } from '@twy-gmbh/erc725-playground';
import { ethers } from 'ethers';
import { LoadingIndicatorService } from './loading-indicator.service';

@Injectable({
  providedIn: 'root',
})
export class KeyManagerService {
  contract: ERC734KeyManager;
  isContractDeployed = false;

  constructor(private web3Service: Web3Service) {}

  getContract(address: string) {
    this.contract = new ERC734KeyManagerFactory(this.web3Service.signer).attach(address);
    return this.contract;
  }

  async deploy(accountAddress: string, managementAddress: string): Promise<ERC734KeyManager> {
    const keyManagerContract = await new ERC734KeyManagerFactory(this.web3Service.signer).deploy(
      accountAddress,
      managementAddress
    );

    await keyManagerContract.deployed();

    this.contract = keyManagerContract;
    return keyManagerContract;
  }
}
