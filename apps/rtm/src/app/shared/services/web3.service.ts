import { Injectable } from '@angular/core';
import Web3 from 'web3';

// allow custom properties on the window object
declare global {
  interface Window {
    [index: string]: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  web3: any; // use proper tyings
  constructor() {
    const ethEnabled = () => {
      if (window.ethereum) {
        // window.ethereum.autoRefreshOnNetworkChange = false;
        this.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        return true;
      }
      return false;
    };

    if (!ethEnabled()) {
      alert(
        'Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!'
      );
    }
  }
}
