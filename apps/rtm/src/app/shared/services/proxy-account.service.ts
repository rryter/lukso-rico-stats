import { Injectable } from '@angular/core';
import { Web3Service } from '@lukso/web3-rx';
const proxyAccountContract = require('../../../../../../../ERC725/implementations/build/contracts/ERC725Account.json');

@Injectable({
  providedIn: 'root',
})
export class ProxyAccountService {
  contract: any;
  constructor(private web3Service: Web3Service) {
    this.contract = new this.web3Service.web3.eth.Contract(proxyAccountContract.abi);
  }

  deployProxyAccount() {
    return this.contract
      .deploy({
        data: proxyAccountContract.bytecode,
        arguments: [this.web3Service.web3.currentProvider.selectedAddress],
      })
      .send({
        from: this.web3Service.web3.currentProvider.selectedAddress,
      });
  }
}
