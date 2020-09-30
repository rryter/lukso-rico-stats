import { Component, OnInit } from '@angular/core';
import { Web3Service } from '@lukso/web3-rx';
import { forkJoin, Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { Capabilities } from './../../shared/capabilities.enum';
import { KeyManagerService } from '../../shared/services/key-manager.service';
import { environment } from '../../../environments/environment';
import { keccak256 } from 'web3-utils';

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
  keyManagerData$: Observable<{ address: string; key: any }>;

  Capabilities = Capabilities;
  environment = environment;

  constructor(private web3Service: Web3Service, private keyManagerService: KeyManagerService) {
    this.keyManagerData$ = this.web3Service.reloadTrigger$.pipe(
      switchMap(() => this.getKeymanagerData$()),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  ngOnInit(): void {}

  addKey(keyKuprose: Capabilities) {
    this.keyManagerService.contract.methods
      .setKey(keccak256(this.getSelectedAddress()), keyKuprose, KEY_TYPE.ECDSA)
      .send({ from: this.getSelectedAddress() });
  }

  getKeymanagerData$() {
    return forkJoin({
      address: of(this.getSelectedAddress()),
      key: this.getKey(),
    });
  }

  removeKey() {
    this.keyManagerService.contract.methods.removeKey().send({ from: this.getSelectedAddress() });
  }

  private getKey() {
    return this.keyManagerService.contract.methods
      .getKey(keccak256(this.getSelectedAddress()))
      .call()
      .then((result) => {
        const { _purposes, _keyType } = result;
        return {
          purpose: _purposes,
          keyType: _keyType,
        };
      });
  }

  private getSelectedAddress() {
    return this.web3Service.web3.currentProvider.selectedAddress;
  }
}
