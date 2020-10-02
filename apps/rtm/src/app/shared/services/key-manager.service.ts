import { Injectable } from '@angular/core';
import { Web3Service } from '@lukso/web3-rx';
import { LoadingIndicatorService } from './loading-indicator.service';
import { Contract } from 'web3-eth-contract';
const keyManagerContract = require('../../../../../../../ERC725/implementations/build/contracts/ERC734KeyManager.json');

@Injectable({
  providedIn: 'root',
})
export class KeyManagerService {
  contract: Contract;
  isContractDeployed = false;

  constructor(
    private web3Service: Web3Service,
    private loadingIndicatorService: LoadingIndicatorService
  ) {
    this.contract = new this.web3Service.web3.eth.Contract(keyManagerContract.abi);
  }

  deploy(managementAddress: string) {
    return this.contract
      .deploy({
        data: keyManagerContract.bytecode,
        arguments: [managementAddress],
      })
      .send({
        from: this.web3Service.web3.currentProvider.selectedAddress,
      })
      .then((contract) => {
        this.isContractDeployed = true;
        this.contract.options.address = contract.options.address;
        this.loadingIndicatorService.showLoadingIndicator(`Transfer Ownership of Proxy Account`);
        return contract;
      });
  }
}
