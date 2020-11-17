import { ethers } from 'ethers';
export function getProviderAndSigner():
  | { provider: ethers.providers.JsonRpcProvider; signer: ethers.Signer }
  | undefined {
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  provider.pollingInterval = 500;
  const signer = provider.getSigner();

  return { provider, signer };
}
