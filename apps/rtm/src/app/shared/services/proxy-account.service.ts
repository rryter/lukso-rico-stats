import { Injectable } from '@angular/core';
import { ERC725Account, ERC725AccountFactory } from '@twy-gmbh/erc725-playground';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root',
})
export class ProxyAccountService {
  contract: ERC725Account;

  constructor() {}

  getContract(address: string) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ERC725AccountFactory(signer).attach(address);
  }

  async deployProxyAccount() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ERC725AccountFactory(signer)
      .deploy(await signer.getAddress())
      .then((contract: ERC725Account) => {
        this.contract = contract;
        return contract;
      });
  }
}
