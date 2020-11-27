import { Injectable } from '@angular/core';
import { Web3Service } from '@shared/services/web3.service';
import { ERC725Account, ERC725AccountFactory } from '@twy-gmbh/erc725-playground';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root',
})
export class ProxyAccountService {
  contract: ERC725Account | undefined;

  constructor(private web3Service: Web3Service) {}

  getContract(address: string) {
    this.contract = new ERC725AccountFactory(this.web3Service.signer).attach(address);
    return this.contract;
  }

  getDataStore() {}

  async deployProxyAccount() {
    const signer = this.web3Service.signer;
    this.contract = await new ERC725AccountFactory(signer).deploy(this.web3Service.selectedAddress);
    await this.contract.deployed();

    return this.contract;
  }
}
