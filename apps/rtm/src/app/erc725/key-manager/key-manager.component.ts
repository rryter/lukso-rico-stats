import { Component, Input, OnInit } from '@angular/core';
import { Web3Service } from '@shared/services/web3.service';
import { forkJoin, Observable, ReplaySubject, Subject } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import { Capabilities, KEY_TYPE } from '@shared/capabilities.enum';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AddKeyComponent } from './add-key/add-key.component';
import { bigNumbertoIntArray } from '@shared/utils/bigNumber';
import { Contract, ContractTransaction, Transaction, utils } from 'ethers';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';

@Component({
  selector: 'lukso-key-manager',
  templateUrl: './key-manager.component.html',
  styleUrls: ['./key-manager.component.css'],
})
export class KeyManagerComponent implements OnInit {
  loadKeys = new ReplaySubject();

  keyManagerData$: Observable<{ address: string; keyType: any; privileges: any[] }[]>;
  isKeyManager$: Observable<boolean>;

  isManageDropdownActive = false;
  Capabilities = Capabilities;
  environment = environment;

  @Input() contractAddress: string;

  constructor(
    public dialog: MatDialog,
    private web3Service: Web3Service,
    private keyManagerService: KeyManagerService,
    private loadingIndicatorService: LoadingIndicatorService
  ) {
    this.keyManagerData$ = this.web3Service.reloadTrigger$.pipe(
      tap(() => {
        console.count('reloadTrigger$ KeyManagerComponent');
      }),
      switchMap(() => this.getAllKeys()),
      switchMap((keys: any[]) => this.getKeymanagerData$(keys)),
      shareReplay(1)
    );

    this.loadKeys.next();
    this.keyManagerService.contract.on('KeyRemoved', () => {
      this.loadKeys.next();
    });
    this.keyManagerService.contract.on('KeySet', () => {
      this.loadKeys.next();
    });
  }

  ngOnInit(): void {}

  openDialog(title: string, data: any): void {
    const dialogRef = this.dialog.open(AddKeyComponent, {
      data: {
        address: this.getSelectedAddress(),
      },
    });

    dialogRef.afterClosed().subscribe((sendAddKey: Promise<ContractTransaction>) => {
      sendAddKey
        .then((transaction: ContractTransaction) => {
          return transaction.wait();
        })
        .finally(() => {
          this.loadingIndicatorService.doneLoading();
        });
    });
  }

  addKey(keyKuprose: Capabilities[]) {
    this.loadingIndicatorService.showLoadingIndicator('asd');
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
    this.loadingIndicatorService.showLoadingIndicator('Removing Key');
    this.keyManagerService.contract
      .removeKey(utils.keccak256(key.address), key.index)
      .then((tx) => tx.wait())
      .finally(() => {
        this.loadingIndicatorService.doneLoading();
      });
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
          _keyAddress.toLowerCase() === this.web3Service.selectedAddress.toLowerCase(),
        address: _keyAddress,
        privileges: bigNumbertoIntArray(_privilegesLUT),
        keyType: _keyType.toNumber(),
        index: keys.indexOf(key),
      };
    });
  }

  private getSelectedAddress() {
    return this.web3Service.selectedAddress;
  }
}
