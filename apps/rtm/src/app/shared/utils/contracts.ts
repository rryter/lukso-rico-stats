import { Contract } from 'ethers';
export function isContractDeployed(contract: Contract | null): Promise<undefined | Contract> {
  if (contract === null) {
    return Promise.resolve(undefined);
  }
  return contract.deployed().catch(() => {
    return undefined;
  });
}
