import { BigNumber } from 'ethers';
export function bigNumbertoIntArray(numberArray: BigNumber[]): number[] {
  return numberArray.map((bigNumber) => bigNumber.toNumber());
}
