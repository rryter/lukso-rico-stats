import { ethers } from 'ethers';

export function getProviderAndSigner():
  | { provider: ethers.providers.Web3Provider; signer: ethers.Signer }
  | undefined {
  if (window.ethereum) {
    window.ethereum.autoRefreshOnNetworkChange = false;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.pollingInterval = 2000;
    const signer = provider.getSigner();
    return { provider, signer };
  } else {
    return undefined;
  }
}
