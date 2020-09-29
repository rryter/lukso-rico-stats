import { Injectable } from '@angular/core';
import { Web3Service } from '@lukso/web3-rx';
import { LoadingIndicatorService } from './loading-indicator.service';
const keyManagerContract = require('../../../../../../../ERC725/implementations/build/contracts/ERC734KeyManager.json');

@Injectable({
  providedIn: 'root',
})
export class KeyManagerService {
  contract: any;
  isContractDeployed = false;

  constructor(
    private web3Service: Web3Service,
    private loadingIndicatorService: LoadingIndicatorService
  ) {
    const address = JSON.parse(window.localStorage.getItem('acl-address'));
    if (address) {
      this.contract = new this.web3Service.web3.eth.Contract(keyManagerContract.abi, address);
    } else {
      this.contract = new this.web3Service.web3.eth.Contract(keyManagerContract.abi);
    }
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
        this.contract.options.address = contract._address;
        window.localStorage.setItem('acl-address', JSON.stringify(contract._address));
        this.loadingIndicatorService.showLoadingIndicator(`Transfer Ownership of Proxy Account`);
        return contract;
      });
  }
}
