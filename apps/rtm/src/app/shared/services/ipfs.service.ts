import { Injectable } from '@angular/core';
import ipfsClient from 'ipfs-http-client';
import { ClientOptions } from 'ipfs-http-client/src/lib/core';

@Injectable({
  providedIn: 'root',
})
export class IpfsService {
  ipfs: any; // TODO figure out proper type
  constructor() {
    const options: ClientOptions = {
      protocol: 'https',
      host: 'ipfs.infura.io',
    };
    this.ipfs = ipfsClient(options);
  }
}
