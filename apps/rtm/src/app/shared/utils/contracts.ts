import { Contract } from 'ethers';
export function isContractDeployed(contract: Contract | null): Promise<null | Contract> {
  if (contract === null) {
    return Promise.resolve(null);
  }
  return contract.deployed().catch(() => {
    return null;
  });
}
