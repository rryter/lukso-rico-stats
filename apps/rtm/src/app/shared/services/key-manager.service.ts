import { Injectable } from '@angular/core';
import { Web3Service } from '@shared/services/web3.service';
import { ERC734KeyManager, ERC734KeyManagerFactory } from '@twy-gmbh/erc725-playground';

@Injectable({
  providedIn: 'root',
})
export class KeyManagerService {
  contract: ERC734KeyManager | undefined;
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

    this.contract = keyManagerContract;
    return keyManagerContract;
  }

  getIsExecutor(address: string): Promise<boolean> {
    if (!this.contract) {
      throw Error('contract not available');
    }
    return this.contract
      .deployed()
      .then((contract) => {
        return contract.hasPrivilege(address, 2);
      })
      .catch(() => {
        return false;
      });
  }

  getIsManager(address: string): Promise<boolean> {
    if (!this.contract) {
      throw Error('contract not available');
    }
    return this.contract
      .deployed()
      .then((contract) => {
        return contract.hasPrivilege(address, 1);
      })
      .catch(() => {
        return false;
      });
  }
}
