import { Component, Input, OnInit } from '@angular/core';
import { Web3Service } from '@lukso/web3-rx';
import { forkJoin, Observable } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { Capabilities, KEY_TYPE } from '@shared/capabilities.enum';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { environment } from '../../../environments/environment';
import { keccak256 } from 'web3-utils';
import { MatDialog } from '@angular/material/dialog';
import { AddKeyComponent } from './add-key/add-key.component';
import { bigNumbertoIntArray } from '@shared/utils/bigNumber';
@Component({
  selector: 'lukso-key-manager',
  templateUrl: './key-manager.component.html',
  styleUrls: ['./key-manager.component.css'],
})
export class KeyManagerComponent implements OnInit {
  keyManagerData$: Observable<{ address: string; keyType: any; privileges: any[] }[]>;
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

  openDialog(title: string, data: any): void {
    const dialogRef = this.dialog.open(AddKeyComponent, {
      data: {
        address: this.getSelectedAddress(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  addKey(keyKuprose: Capabilities[]) {
    this.keyManagerService.contract.setKey(this.getSelectedAddress(), keyKuprose, KEY_TYPE.ECDSA);
  }

  getKeymanagerData$(keys: any[]) {
    return forkJoin(
      keys.map((key) => {
        return this.getKey(key, keys);
      })
    );
  }

  removeKey(key: { address: string; index: number }) {
    this.keyManagerService.contract.removeKey(keccak256(key.address), key.index);
  }

  private getAllKeys(): Promise<any[]> {
    return this.keyManagerService.contract.getAllKeys();
  }

  private getKey(
    key: string,
    keys: string[]
  ): Promise<{ address: string; keyType: number; privileges: number[] }> {
    return this.keyManagerService.contract.getKey(key).then((result) => {
      const { _keyAddress, _privilegesLUT, _keyType } = result;
      return {
        isCurrentWallet:
          _keyAddress.toLowerCase() ===
          this.web3Service.web3.currentProvider.selectedAddress.toLowerCase(),
        address: _keyAddress,
        privileges: bigNumbertoIntArray(_privilegesLUT),
        keyType: _keyType.toNumber(),
        index: keys.indexOf(key),
      };
    });
  }

  private getSelectedAddress() {
    return this.web3Service.web3.currentProvider.selectedAddress;
  }
}
