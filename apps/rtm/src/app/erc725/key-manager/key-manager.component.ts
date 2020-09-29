import { Component, OnInit } from '@angular/core';
import { Web3Service } from '@lukso/web3-rx';
import { concat, forkJoin, merge, Observable, of } from 'rxjs';
import { share, shareReplay, switchMap } from 'rxjs/operators';
import { Capabilities } from './../../shared/capabilities.enum';
import { environment } from '../../../environments/environment';
import { keccak256 } from 'web3-utils';
const keyManagerContract = require('../../../../../../../ERC725/implementations/build/contracts/ERC734KeyManager.json');

enum KEY_TYPE {
  ECDSA = 1,
  RSA,
}

@Component({
  selector: 'lukso-key-manager',
  templateUrl: './key-manager.component.html',
  styleUrls: ['./key-manager.component.css'],
})
export class KeyManagerComponent implements OnInit {
  keyManagerContract: any;
  keyManagerData$: Observable<any>;
  keyManagerContractAddress: string;
  isContractDeployed = false;
  Capabilities = Capabilities;
  environment = environment;

  constructor(private web3Service: Web3Service) {
    this.keyManagerData$ = this.web3Service.reloadTrigger$.pipe(
      switchMap(() => {
        return this.getKeymanagerData$();
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  ngOnInit(): void {
    this.keyManagerContractAddress = JSON.parse(window.localStorage.getItem('acl-address'));
    if (this.keyManagerContractAddress) {
      this.keyManagerContract = new this.web3Service.web3.eth.Contract(
        keyManagerContract.abi,
        this.keyManagerContractAddress
      );
      this.isContractDeployed = true;
    }
  }

  initialize() {
    this.keyManagerContract.methods
      .initialize()
      .send({ from: this.web3Service.web3.currentProvider.selectedAddress });
  }

  addKey(keyKuprose: Capabilities) {
    console.log(this.keyManagerContract.options.address);
    this.keyManagerContract.methods
      .setKey(
        keccak256(this.web3Service.web3.currentProvider.selectedAddress),
        keyKuprose,
        KEY_TYPE.ECDSA
      )
      .send({ from: this.web3Service.web3.currentProvider.selectedAddress });
  }

  getKeymanagerData$() {
    return forkJoin({
      address: of(this.web3Service.web3.currentProvider.selectedAddress),
      key: this.getKey(),
    });
  }

  removeKey() {
    this.keyManagerContract.methods
      .removeKey()
      .send({ from: this.web3Service.web3.currentProvider.selectedAddress });
  }

  private getOwner() {
    return this.keyManagerContract.methods.owner().call();
  }

  private getKey() {
    return this.keyManagerContract.methods
      .getKey(keccak256(this.web3Service.web3.currentProvider.selectedAddress))
      .call()
      .then((result) => {
        const { _purposes, _keyType } = result;
        return {
          purpose: _purposes,
          keyType: _keyType,
        };
      });
  }
}
