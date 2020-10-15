import { Component, Input, OnInit } from '@angular/core';
import { Web3Service } from '@lukso/web3-rx';
import { forkJoin, Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { Capabilities, KEY_TYPE } from '@shared/capabilities.enum';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { environment } from '../../../environments/environment';
import { keccak256 } from 'web3-utils';
import { MatDialog } from '@angular/material/dialog';
import { AddKeyComponent } from './add-key/add-key.component';

@Component({
  selector: 'lukso-key-manager',
  templateUrl: './key-manager.component.html',
  styleUrls: ['./key-manager.component.css'],
})
export class KeyManagerComponent implements OnInit {
  keyManagerData$: Observable<{ address: string; keyType: any; purpose: any }[]>;
  isKeyManager$: Observable<boolean>;

  isManageDropdownActive = false;
  Capabilities = Capabilities;
  environment = environment;

  @Input() contractAddress: string;

  constructor(
    private web3Service: Web3Service,
    private keyManagerService: KeyManagerService,
    public dialog: MatDialog
  ) {
    this.keyManagerData$ = this.web3Service.reloadTrigger$.pipe(
      switchMap(() => this.getAllKeys()),
      switchMap((keys: any[]) => this.getKeymanagerData$(keys)),
      shareReplay(1)
    );
  }

  ngOnInit(): void {}

  openDialog(a, b): void {
    const dialogRef = this.dialog.open(AddKeyComponent, {
      data: {
        address: this.getSelectedAddress(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  addKey(keyKuprose: Capabilities) {
    this.keyManagerService.contract.methods
      .setKey(this.getSelectedAddress(), keyKuprose, KEY_TYPE.ECDSA)
      .send({ from: this.getSelectedAddress() });
  }

  getKeymanagerData$(keys: any[]) {
    return forkJoin(
      keys.map((key) => {
        return this.getKey(key);
      })
    );
  }

  removeKey(address) {
    this.keyManagerService.contract.methods
      .removeKey(keccak256(address))
      .send({ from: this.getSelectedAddress() });
  }

  private getAllKeys(): Promise<any[]> {
    this.keyManagerService.contract.options.address = this.contractAddress;
    return this.keyManagerService.contract.methods.getAllKeys().call();
  }

  private getKey(key: string): Promise<{ address: string; keyType: any; purpose: any }> {
    return this.keyManagerService.contract.methods
      .getKey(key)
      .call()
      .then((result) => {
        const { _keyAddress, _purpose, _keyType } = result;
        return {
          isCurrentWallet:
            _keyAddress.toLowerCase() ===
            this.web3Service.web3.currentProvider.selectedAddress.toLowerCase(),
          address: _keyAddress,
          purpose: _purpose,
          keyType: _keyType,
        };
      });
  }

  private getSelectedAddress() {
    return this.web3Service.web3.currentProvider.selectedAddress;
  }
}
