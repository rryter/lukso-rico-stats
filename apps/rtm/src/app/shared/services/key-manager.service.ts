import { Injectable } from '@angular/core';
import { Web3WrapperService } from '@lukso/web3-rx';
const keyManagerContract = require('../../../../../../../ERC725/implementations/build/contracts/ERC734KeyManager.json');

@Injectable({
  providedIn: 'root',
})
export class KeyManagerService {
  contract: any;
  isContractDeployed = false;
  constructor(private web3Service: Web3WrapperService) {
    this.contract = new this.web3Service.web3.eth.Contract(keyManagerContract.abi);
  }

  deploy() {
    return this.contract
      .deploy({
        data: keyManagerContract.bytecode,
      })
      .send({
        from: this.web3Service.web3.currentProvider.selectedAddress,
      })
      .then((contract) => {
        console.log(contract);
        this.isContractDeployed = true;
        this.contract.options.address = contract._address;
        window.localStorage.setItem('acl-address', JSON.stringify(contract._address));
        return contract;
      });
  }
}
