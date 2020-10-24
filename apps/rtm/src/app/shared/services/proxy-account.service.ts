import { Injectable } from '@angular/core';
import { Web3Service } from '@lukso/web3-rx';
import { Contract } from 'web3-eth-contract';
const proxyAccountContract = require('../../../../../../../TWY/erc725-playground/artifacts/ERC725Account.json');

@Injectable({
  providedIn: 'root',
})
export class ProxyAccountService {
  contract: Contract;

  constructor(private web3Service: Web3Service) {
    this.contract = new this.web3Service.web3.eth.Contract(proxyAccountContract.abi);
  }

  deployProxyAccount() {
    const selectedAddress = this.web3Service.web3.currentProvider.selectedAddress;
    return this.contract
      .deploy({
        data: proxyAccountContract.bytecode,
        arguments: [selectedAddress],
      })
      .send({
        from: selectedAddress,
      });
  }
}
