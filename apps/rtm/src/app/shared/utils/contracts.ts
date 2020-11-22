import { Contract } from 'ethers';
export function isContractDeployed(keyManagerContract: Contract): Promise<false | Contract> {
  return keyManagerContract.deployed().catch(() => {
    return false;
  });
}
