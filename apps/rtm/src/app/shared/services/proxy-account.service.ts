import { Injectable } from '@angular/core';
import { Web3Service } from '@lukso/web3-rx';
import { Erc725Account, Erc725AccountFactory } from '@twy-gmbh/erc725-playground';

@Injectable({
  providedIn: 'root',
})
export class ProxyAccountService {
  contract: Erc725Account;

  constructor(private web3Service: Web3Service) {}

  deployProxyAccount() {
    const selectedAddress = this.web3Service.web3.currentProvider.selectedAddress;
    return new Erc725AccountFactory().deploy(selectedAddress).then((contract) => {
      this.contract = contract;
      return contract;
    });
  }
}
