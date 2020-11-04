import { Injectable } from '@angular/core';
import { Web3Service } from '@lukso/web3-rx';
import { Erc725Account, Erc725AccountFactory } from '@twy-gmbh/erc725-playground';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root',
})
export class ProxyAccountService {
  contract: Erc725Account;

  constructor(private web3Service: Web3Service) {}

  getContract(address: string) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new Erc725AccountFactory(signer).attach(address);
  }

  deployProxyAccount() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const selectedAddress = this.web3Service.web3.currentProvider.selectedAddress;
    return new Erc725AccountFactory(signer)
      .deploy(selectedAddress)
      .then((contract: Erc725Account) => {
        this.contract = contract;
        return contract;
      });
  }
}
