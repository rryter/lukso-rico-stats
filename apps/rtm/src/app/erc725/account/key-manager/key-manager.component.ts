import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Web3Service } from '@shared/services/web3.service';
import { forkJoin, NEVER, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { Capabilities, KEY_TYPE } from '@shared/capabilities.enum';
import { KeyManagerService } from '@shared/services/key-manager.service';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AddKeyComponent } from './add-key/add-key.component';
import { bigNumbertoIntArray } from '@shared/utils/bigNumber';
import { ContractTransaction, utils } from 'ethers';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import { ERC734KeyManager } from '@twy-gmbh/erc725-playground';

export interface KeyManagerData {
  address: string;
  keyType: any;
  privileges: any[];
}

@Component({
  selector: 'lukso-key-manager',
  templateUrl: './key-manager.component.html',
  styleUrls: ['./key-manager.component.css'],
})
export class KeyManagerComponent implements OnInit, OnChanges {
  loadKeys = new ReplaySubject();

  keyManagerData$: Observable<{ keyManagerData: KeyManagerData[]; error: string }>;
  isKeyManager$: Observable<boolean>;

  isManageDropdownActive = false;
  Capabilities = Capabilities;
  environment = environment;

  // ERC734KeyManager
  @Input() keyManagerContract: any;

  constructor(
    public dialog: MatDialog,
    private web3Service: Web3Service,
    private keyManagerService: KeyManagerService,
    private loadingIndicatorService: LoadingIndicatorService
  ) {
    // this.loadKeys.next();
    // this.keyManagerService.contract.on('KeyRemoved', () => {
    //   this.loadKeys.next();
    // });
    // this.keyManagerService.contract.on('KeySet', () => {
    //   this.loadKeys.next();
    // });
  }

  ngOnInit(): void {
    this.keyManagerData$ = this.web3Service.reloadTrigger$.pipe(
      switchMap(() => this.getAllKeys()),
      switchMap((keys: string[]) => this.getKeymanagerData$(keys)),
      map((keyManagerData: KeyManagerData[]) => {
        return { keyManagerData, error: undefined };
      }),
      shareReplay(1),
      catchError((error) => {
        return of({
          keyManagerData: [],
          error: error.message,
        });
      })
    );
  }
  ngOnChanges(changes: SimpleChanges): void {}

  openDialog(
    label: string,
    data: { buttonLabel: string; address: string; privileges: number[] }
  ): void {
    const dialogRef = this.dialog.open(AddKeyComponent, {
      data: {
        buttonLabel: label,
        address: data.address,
        privileges: data.privileges,
      },
      width: '50vw',
      height: '100%',
      position: {
        right: '0',
      },
      direction: 'ltr',
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

  onShowEditDialog(key: any) {
    this.openDialog('Update', { ...key });
  }

  private getAllKeys(): Promise<any[]> {
    return this.keyManagerContract.getAllKeys();
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
